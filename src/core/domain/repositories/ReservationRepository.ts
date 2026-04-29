export interface ReservationItemEntity {
  productId: string;
  quantity: number;
}

export interface ReservationEntity {
  id: string;
  customer_name: string;
  phone_number: string;
  city: string;
  pickup_time: Date | null;
  status: string;
  items: ReservationItemEntity[];
}

export interface ReservationRepository {
  create(data: Omit<ReservationEntity, 'id'>): Promise<ReservationEntity>;
}
