import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { BookingsService } from '../../../../core/services/bookings.service';
import { BookingStatus } from '../../../../core/models/booking.model';
import { MarketplaceNavMenu } from '../../../../shared/components/marketplace-nav-menu/marketplace-nav-menu';

@Component({
  selector: 'app-my-bookings',
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MarketplaceNavMenu,
  ],
  templateUrl: './my-bookings.page.html',
})
export class MyBookingsPage {
  private bookingsService = inject(BookingsService);

  tabStatuses: BookingStatus[] = ['pending', 'confirmed', 'rejected', 'cancelled'];

  activeStatus = signal<BookingStatus>('pending');

  bookings = rxResource({
    stream: () => this.bookingsService.getBookingsByClient(),
  });

  filteredBookings = computed(() =>
    (this.bookings.value() ?? []).filter(
      (booking) => booking.status === this.activeStatus(),
    ),
  );

  onTabChange(index: number) {
    const status = this.tabStatuses[index];
    if (status) {
      this.activeStatus.set(status);
    }
  }
}