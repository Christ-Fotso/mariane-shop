import nodemailer from 'nodemailer';
import { ReservationRepository, ReservationEntity } from '../../domain/repositories/ReservationRepository';
import { readSecret } from '../../infrastructure/secrets/readSecret';

export class CreateReservationUseCase {
  constructor(private reservationRepository: ReservationRepository) {}

  async execute(data: Omit<ReservationEntity, 'id'>): Promise<ReservationEntity> {
    const reservation = await this.reservationRepository.create(data);

    // Send email notification to admin — non-blocking
    this.sendNotificationEmail(reservation).catch((err) =>
      console.error("Erreur d'envoi e-mail de notification:", err)
    );

    return reservation;
  }

  private async sendNotificationEmail(reservation: ReservationEntity): Promise<void> {
    const host = readSecret('EMAIL_HOST');
    const port = parseInt(readSecret('EMAIL_PORT'), 10);
    const user = readSecret('EMAIL_USER');
    const pass = readSecret('EMAIL_PASS');
    const adminEmail = readSecret('ADMIN_EMAIL');

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Ladie's Corner - Notifications" <${user}>`,
      to: adminEmail,
      subject: `🛍️ Nouvelle Réservation — ${reservation.customer_name} (${reservation.city})`,
      text: [
        "Vous avez reçu une nouvelle réservation sur Ladie's Corner !",
        '',
        `Nom/Pseudo    : ${reservation.customer_name}`,
        `Téléphone     : ${reservation.phone_number}`,
        `Ville         : ${reservation.city}`,
        `Heure prévue  : ${reservation.pickup_time ? new Date(reservation.pickup_time).toLocaleString('fr-FR') : 'Non précisée'}`,
        '',
        'Articles réservés :',
        ...reservation.items.map((item) => `  - ${item.quantity}x produit (ID: ${item.productId})`),
      ].join('\n'),
    });
  }
}
