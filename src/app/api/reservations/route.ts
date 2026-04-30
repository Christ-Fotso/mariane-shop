import { NextResponse } from 'next/server';
import { PrismaReservationRepository } from '@/core/infrastructure/repositories/PrismaReservationRepository';
import { CreateReservationUseCase } from '@/core/application/use-cases/CreateReservationUseCase';
import nodemailer from 'nodemailer';

export const dynamic = 'force-dynamic';

// Simple phone number validation: allows digits, spaces, +, -, ()
const PHONE_REGEX = /^[+\d][\d\s\-().]{5,19}$/;
const NAME_MAX_LENGTH = 100;
const CITY_MAX_LENGTH = 100;
const MAX_ITEMS = 50;

async function sendReservationEmail(reservation: {
  id: string;
  customer_name: string;
  phone_number: string;
  city: string;
  pickup_time: Date | null;
  items: Array<{ name: string; quantity: number; price: number }>;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const itemsHtml = reservation.items.map(item =>
      `<li><strong>${item.quantity}x ${item.name}</strong> — ${item.price.toLocaleString('fr-FR')} FCFA</li>`
    ).join('');

    const total = reservation.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    await transporter.sendMail({
      from: `"Ladie's Corner" <${process.env.EMAIL_USER}>`,
      to: 'kengnemariane01@gmail.com',
      subject: `🛍️ Nouvelle Réservation — ${reservation.customer_name}`,
      html: `
        <h2>Nouvelle Réservation Reçue</h2>
        <p><strong>Client :</strong> ${reservation.customer_name}</p>
        <p><strong>Téléphone :</strong> ${reservation.phone_number}</p>
        <p><strong>Ville :</strong> ${reservation.city}</p>
        <p><strong>Heure souhaitée :</strong> ${reservation.pickup_time ? new Date(reservation.pickup_time).toLocaleString('fr-FR') : 'Non spécifiée'}</p>
        <hr/>
        <h3>Articles commandés :</h3>
        <ul>${itemsHtml}</ul>
        <p><strong>Total estimé : ${total.toLocaleString('fr-FR')} FCFA</strong></p>
        <hr/>
        <p><a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin">→ Voir dans le tableau de bord</a></p>
      `,
    });
  } catch (err) {
    // Don't fail the reservation if email fails
    console.error('Email notification error:', err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, phone_number, city, pickup_time, items } = body;

    // --- Input validation ---
    if (
      !customer_name ||
      typeof customer_name !== 'string' ||
      customer_name.trim().length === 0 ||
      customer_name.length > NAME_MAX_LENGTH
    ) {
      return NextResponse.json({ error: 'Nom invalide (1-100 caractères).' }, { status: 400 });
    }

    if (!phone_number || typeof phone_number !== 'string' || !PHONE_REGEX.test(phone_number.trim())) {
      return NextResponse.json({ error: 'Numéro de téléphone invalide.' }, { status: 400 });
    }

    if (
      !city ||
      typeof city !== 'string' ||
      city.trim().length === 0 ||
      city.length > CITY_MAX_LENGTH
    ) {
      return NextResponse.json({ error: 'Ville invalide.' }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
      return NextResponse.json({ error: 'Panier vide ou invalide.' }, { status: 400 });
    }

    for (const item of items) {
      if (
        typeof item.id !== 'string' ||
        item.id.trim().length === 0 ||
        typeof item.cartQuantity !== 'number' ||
        item.cartQuantity < 1 ||
        item.cartQuantity > 9999
      ) {
        return NextResponse.json({ error: 'Article invalide dans le panier.' }, { status: 400 });
      }
    }

    const repository = new PrismaReservationRepository();
    const useCase = new CreateReservationUseCase(repository);

    const reservation = await useCase.execute({
      customer_name: customer_name.trim(),
      phone_number: phone_number.trim(),
      city: city.trim(),
      pickup_time: pickup_time ? new Date(pickup_time) : null,
      status: 'PENDING',
      items: items.map((item: any) => ({
        productId: item.id,
        quantity: item.cartQuantity,
      })),
    });

    // Send email notification (non-blocking)
    sendReservationEmail({
      id: reservation.id,
      customer_name: customer_name.trim(),
      phone_number: phone_number.trim(),
      city: city.trim(),
      pickup_time: pickup_time ? new Date(pickup_time) : null,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.cartQuantity,
        price: item.price,
      })),
    });

    return NextResponse.json({ success: true, reservationId: reservation.id }, { status: 201 });
  } catch (error) {
    console.error('API Reservation Error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la réservation.' }, { status: 500 });
  }
}
