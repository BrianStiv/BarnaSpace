export type BookingStatus = 'pending' | 'confirmed' | 'rejected' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'released';

export interface Booking {
  id?: string;
  spaceId: string;
  spaceName: string;
  clientId: string;
  clientName: string;
  hostId: string;
  date: string;
  guests: number;
  totalPrice: number;
  paymentMethod: 'simulated';
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  createdAt?: Date;
}