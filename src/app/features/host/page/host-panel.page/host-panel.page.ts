import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { BookingsService } from '../../../../core/services/bookings.service';
import { SpacesService } from '../../../../core/services/spaces.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';
import { SpaceModel } from '../../../../core/models/space.model';
import { AuthService } from '../../../auth/service/auth.service';

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
  private spacesService = inject(SpacesService);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  user = toSignal(this.authService.currentUser$, { initialValue: null });

  tabStatuses: BookingStatus[] = ['pending', 'confirmed', 'rejected', 'cancelled'];

  activeStatus = signal<BookingStatus>('pending');

  bookingsResource = rxResource({
    stream: () => this.bookingsService.getBookingsByHost(),
  });

  spacesResource = rxResource({
    params: () => this.user()?.uid,
    stream: ({ params }) => (params ? this.spacesService.getByHost(params) : of([])),
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

  statusInfo(status: SpaceModel['publicationStatus']) {
    return {
      pending_approval: { label: 'Pendiente', badge: 'bg-mustard/10 text-mustard' },
      published: { label: 'Publicado', badge: 'bg-forest/10 text-forest' },
      rejected: { label: 'Rechazado', badge: 'bg-error/10 text-error' },
      deactivated: { label: 'Desactivado', badge: 'bg-medium/10 text-medium' },
    }[status];
  }

  onTabChange(status: BookingStatus) {
    this.activeStatus.set(status);
  }

  async onApprove(booking: Booking) {
    this.processing.set(true);

    try {
      await this.bookingsService.approveBooking(booking);
      this.toast.show('Reserva aprobada.');
      this.bookingsResource.reload();
    } catch (error) {
      console.error('Approve error:', error);
      this.toast.show('Error al aprobar la reserva.');
    } finally {
      this.processing.set(false);
    }
  }

  async onReject(booking: Booking) {
    this.processing.set(true);

    try {
      await this.bookingsService.rejectBooking(booking);
      this.toast.show('Reserva rechazada.');
      this.bookingsResource.reload();
    } catch (error) {
      console.error('Reject error:', error);
      this.toast.show('Error al rechazar la reserva.');
    } finally {
      this.processing.set(false);
    }
  }
}