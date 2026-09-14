import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  query,
  where,
  limit,
  doc,
  addDoc,
  updateDoc,
  writeBatch,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { Auth, User, user } from '@angular/fire/auth';
import { Observable, of, firstValueFrom } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { Booking } from '../models/booking.model';
import { SpaceModel } from '../models/space.model';
import { SpacesService } from './spaces.service';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);
  private spacesService = inject(SpacesService);

  private bookingsCollection = collection(this.firestore, 'bookings');

  private getRequiredUser(): User | null {
    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      console.warn('Usuario no autenticado');
      return null;
    }

    return currentUser;
  }

  async checkAvailability(spaceId: string, date: string): Promise<boolean> {
    const space = await firstValueFrom(this.spacesService.getById(spaceId));
    const blockedDates = space.blockedDates || [];
    const isDateBlocked = blockedDates.includes(date);

    return !isDateBlocked;
  }

  async createBooking(space: SpaceModel, date: string, guests: number): Promise<void> {
    const currentUser = this.getRequiredUser();

    if (!currentUser) {
      throw new Error('Debes iniciar sesion para realizar una reserva');
    }

    const clientName = currentUser.displayName || currentUser.email || 'Usuario';

    const newBooking: Omit<Booking, 'id'> = {
      spaceId: space.id!,
      spaceName: space.name,
      clientId: currentUser.uid,
      clientName,
      hostId: space.hostId,
      date,
      guests,
      totalPrice: space.dailyPrice,
      paymentMethod: 'simulated',
      paymentStatus: 'pending',
      status: 'pending',
      createdAt: new Date(),
    };

    await addDoc(this.bookingsCollection, newBooking);
  }

  getAllBookings(maxItems = 200): Observable<Booking[]> {
    const q = query(this.bookingsCollection, limit(maxItems));
    return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
  }

  getBookingsByClient(): Observable<Booking[]> {
    return user(this.auth).pipe(
      switchMap((currentUser) => {
        if (!currentUser) return of([]);

        const q = query(this.bookingsCollection, where('clientId', '==', currentUser.uid));
        return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
      }),
    );
  }

  getBookingsByHost(): Observable<Booking[]> {
    return user(this.auth).pipe(
      switchMap((currentUser) => {
        if (!currentUser) return of([]);

        const q = query(this.bookingsCollection, where('hostId', '==', currentUser.uid));
        return collectionData(q, { idField: 'id' }) as Observable<Booking[]>;
      }),
    );
  }

  getHostRevenue(): Observable<number> {
    return this.getBookingsByHost().pipe(
      map((bookings) =>
        bookings
          .filter((booking) => booking.status === 'confirmed')
          .reduce((total, booking) => total + booking.totalPrice, 0),
      ),
    );
  }

  async approveBooking(booking: Booking): Promise<void> {
    if (!booking.id) return;

    const batch = writeBatch(this.firestore);
    const bookingRef = doc(this.firestore, 'bookings', booking.id);
    const spaceRef = doc(this.firestore, 'spaces', booking.spaceId);

    batch.update(bookingRef, { status: 'confirmed', paymentStatus: 'paid' });
    batch.update(spaceRef, { blockedDates: arrayUnion(booking.date) });

    await batch.commit();
  }

  async rejectBooking(booking: Booking): Promise<void> {
    if (!booking.id) return;

    const bookingRef = doc(this.firestore, 'bookings', booking.id);
    await updateDoc(bookingRef, { status: 'rejected', paymentStatus: 'released' });
  }

  async cancelBooking(booking: Booking): Promise<void> {
    if (!booking.id) return;

    const batch = writeBatch(this.firestore);
    const bookingRef = doc(this.firestore, 'bookings', booking.id);

    batch.update(bookingRef, { status: 'cancelled', paymentStatus: 'released' });

    if (booking.status === 'confirmed') {
      const spaceRef = doc(this.firestore, 'spaces', booking.spaceId);
      batch.update(spaceRef, {
        blockedDates: arrayRemove(booking.date),
      });
    }

    await batch.commit();
  }
}