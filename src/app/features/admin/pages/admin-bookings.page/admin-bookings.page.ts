import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminTable, AdminTableColumn } from '../../component/admin-table/admin-table';
import { AdminDetailPanel, DetailSection } from '../../component/admin-detail-panel/admin-detail-panel';
import { BookingsService } from '../../../../core/services/bookings.service';
import { Booking, BookingStatus } from '../../../../core/models/booking.model';
import { ToastService } from '../../../../core/services/toast.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-admin-bookings-page',
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    AdminTable,
    AdminDetailPanel,
    MatIcon
  ],
  templateUrl: './admin-bookings.page.html',
})
export class AdminBookingsPage {
  private bookingsService = inject(BookingsService);
  private toast = inject(ToastService);

  tabStatuses: BookingStatus[] = ['pending', 'confirmed', 'rejected', 'cancelled'];

  activeStatus = signal<BookingStatus>('pending');
  selectedBooking = signal<Booking | null>(null);
  processing = signal(false);

  canCancel = computed(() => {
    const booking = this.selectedBooking();
    return !!booking && (booking.status === 'pending' || booking.status === 'confirmed');
  });

  bookingsResource = rxResource({
    stream: () => this.bookingsService.getAllBookings(),
  });

  filteredBookings = computed(() =>
    (this.bookingsResource.value() ?? []).filter(
      (b) => b.status === this.activeStatus()
    )
  );

  readonly bookingColumns: AdminTableColumn<Booking>[] = [
    { key: 'spaceName', label: 'Espacio' },
    { key: 'clientName', label: 'Cliente' },
    { key: 'date', label: 'Fecha' },
    { key: 'totalPrice', label: 'Precio', format: (b) => `${b.totalPrice} €` },
  ];

  detailSections = computed<DetailSection[]>(() => {
    const b = this.selectedBooking();
    if (!b) return [];

    return [
      {
        title: 'Datos de la reserva',
        fields: [
          { label: 'Espacio', value: b.spaceName },
          { label: 'Cliente', value: b.clientName },
          { label: 'Fecha', value: b.date },
          { label: 'Invitados', value: String(b.guests) },
          { label: 'Precio total', value: `${b.totalPrice} €` },
          { label: 'Estado', value: b.status },
          { label: 'Pago', value: b.paymentStatus },
          { label: 'Creada', value: b.createdAt, type: 'date' },
        ],
      },
    ];
  });

  onTabChange(index: number): void {
    this.activeStatus.set(this.tabStatuses[index]);
    this.resetSelection();
  }

  onRowSelect(booking: Booking): void {
    this.selectedBooking.set(booking);
  }

  async onCancel(): Promise<void> {
    const booking = this.selectedBooking();
    if (!booking?.id) return;

    this.processing.set(true);

    try {
      await this.bookingsService.cancelBooking(booking);
      this.toast.show('Reserva anulada correctamente.');
      this.resetSelection();
      this.bookingsResource.reload();
    } catch (error) {
      console.error('Cancel booking error:', error);
      this.toast.show('Error al anular la reserva.');
    } finally {
      this.processing.set(false);
    }
  }

  private resetSelection(): void {
    this.selectedBooking.set(null);
  }
}