import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BookingsService } from '../../../../core/services/bookings.service';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';

@Component({
  selector: 'app-host-panel',
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './host-panel.page.html',
})
export class HostPanelPage {
  private bookingsService = inject(BookingsService);

  tabStatuses: BookingStatus[] = ['pending', 'confirmed', 'rejected', 'cancelled'];

  activeStatus = signal<BookingStatus>('pending');

  bookingsResource = rxResource({
    stream: () => this.bookingsService.getBookingsByHost(),
  });

  revenue = computed(() =>
    (this.bookingsResource.value() ?? [])
      .filter((booking) => booking.status === 'confirmed')
      .reduce((total, booking) => total + booking.totalPrice, 0),
  );

  filteredBookings = computed(() =>
    (this.bookingsResource.value() ?? []).filter(
      (booking) => booking.status === this.activeStatus(),
    ),
  );

  processing = signal(false);
  feedbackMessage = signal<string | null>(null);

  onTabChange(status: BookingStatus) {
    this.activeStatus.set(status);
    this.feedbackMessage.set(null);
  }

  async onApprove(booking: Booking) {
    this.processing.set(true);
    this.feedbackMessage.set(null);

    try {
      await this.bookingsService.approveBooking(booking);
      this.feedbackMessage.set('Reserva aprobada.');
      this.bookingsResource.reload();
    } catch (error) {
      console.error('Approve error:', error);
      this.feedbackMessage.set('Error al aprobar la reserva.');
    } finally {
      this.processing.set(false);
    }
  }

  async onReject(booking: Booking) {
    this.processing.set(true);
    this.feedbackMessage.set(null);

    try {
      await this.bookingsService.rejectBooking(booking);
      this.feedbackMessage.set('Reserva rechazada.');
      this.bookingsResource.reload();
    } catch (error) {
      console.error('Reject error:', error);
      this.feedbackMessage.set('Error al rechazar la reserva.');
    } finally {
      this.processing.set(false);
    }
  }
}