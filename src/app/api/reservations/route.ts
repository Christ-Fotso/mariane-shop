import { NextResponse } from 'next/server';
import { PrismaReservationRepository } from '@/core/infrastructure/repositories/PrismaReservationRepository';
import { CreateReservationUseCase } from '@/core/application/use-cases/CreateReservationUseCase';

// Simple phone number validation: allows digits, spaces, +, -, ()
const PHONE_REGEX = /^[+\d][\d\s\-().]{5,19}$/;
const NAME_MAX_LENGTH = 100;
const MAX_ITEMS = 50;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_name, phone_number, pickup_time, items } = body;

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
      return NextResponse.json(
        { error: 'Numéro de téléphone invalide.' },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS) {
      return NextResponse.json({ error: 'Panier vide ou invalide.' }, { status: 400 });
    }

    // Validate each item
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
      pickup_time: pickup_time ? new Date(pickup_time) : null,
      status: 'PENDING',
      items: items.map((item: any) => ({
        productId: item.id,
        quantity: item.cartQuantity,
      })),
    });

    // Don't expose internal DB data to public visitors
    return NextResponse.json({ success: true, reservationId: reservation.id }, { status: 201 });
  } catch (error) {
    console.error('API Reservation Error:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la réservation.' }, { status: 500 });
  }
}
