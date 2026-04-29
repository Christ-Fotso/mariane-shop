import { prisma } from '../db/prisma';
import { ReservationEntity, ReservationRepository } from '../../domain/repositories/ReservationRepository';

export class PrismaReservationRepository implements ReservationRepository {
  async create(data: Omit<ReservationEntity, 'id'>): Promise<ReservationEntity> {
    const created = await prisma.reservation.create({
      data: {
        customer_name: data.customer_name,
        phone_number: data.phone_number,
        pickup_time: data.pickup_time,
        status: data.status,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        }
      },
      include: {
        items: true
      }
    });

    return {
      id: created.id,
      customer_name: created.customer_name,
      phone_number: created.phone_number,
      pickup_time: created.pickup_time,
      status: created.status,
      items: created.items.map(i => ({
        productId: i.productId,
        quantity: i.quantity
      }))
    };
  }
}
