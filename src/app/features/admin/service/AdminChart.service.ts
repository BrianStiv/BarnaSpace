import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AdminService } from './admin.service';
import { BookingsService } from '../../../core/services/bookings.service';

@Injectable({ providedIn: 'root' })
export class AdminChartService {
  private adminService = inject(AdminService);
  private bookingsService = inject(BookingsService);

  getUsersByRole(): Observable<{ clients: number; hosts: number }> {
    return this.adminService.getUsers().pipe(
      map((users) => {
        const hosts = users.filter(
          (u) => u.roles.includes('host') && u.hostStatus === 'approved',
        ).length;
        const clients = users.filter((u) => !u.roles.includes('admin')).length - hosts;
        return { clients, hosts };
      }),
    );
  }

  getBookingsByMonth(): Observable<{ month: string; count: number }[]> {
    return this.bookingsService.getAllBookings().pipe(
      map((bookings) => this.groupByMonth(bookings)),
    );
  }

  getBookingsByStatus(): Observable<{ status: string; count: number }[]> {
    return this.bookingsService.getAllBookings().pipe(
      map((bookings) => {
        const statuses = ['pending', 'confirmed', 'rejected', 'cancelled'];
        return statuses.map((status) => ({
          status,
          count: bookings.filter((b) => b.status === status).length,
        }));
      }),
    );
  }

  getSpacesByStatusCount(): Observable<{ status: string; count: number }[]> {
    return this.adminService.getSpaces().pipe(
      map((spaces) => {
        const statuses = ['pending_approval', 'published', 'rejected', 'deactivated'];
        return statuses.map((status) => ({
          status,
          count: spaces.filter((s) => s.publicationStatus === status).length,
        }));
      }),
    );
  }

  private groupByMonth(bookings: { date: string }[]): { month: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const booking of bookings) {
      if (!booking.date) continue;
      const month = booking.date.slice(0, 7);
      counts.set(month, (counts.get(month) ?? 0) + 1);
    }
    return Array.from(counts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }
}