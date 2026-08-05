import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminTable, AdminTableColumn } from '../../component/admin-table/admin-table';
import { AdminNavMenu } from '../../component/admin-nav-menu/admin-nav-menu';
import { AdminService } from '../../service/admin.service';
import { User } from '../../../../core/models/user.model';
import { SpaceModel } from '../../../../core/models/space.model';


@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, AdminTable, AdminNavMenu],
  templateUrl: './admin-dashboard.page.html',
})
export class AdminDashboard {
  private adminService = inject(AdminService);

  metrics = rxResource({ stream: () => this.adminService.getDashboardMetrics() });
  recentUsers = rxResource({ stream: () => this.adminService.getUsers(5) });
  recentSpaces = rxResource({ stream: () => this.adminService.getSpaces(5) });

  metricCards = computed(() => {
    const m = this.metrics.value();
    if (!m) return [];
    return [
      { icon: 'people', value: m.totalUsers, label: 'Usuarios', highlight: false },
      { icon: 'meeting_room', value: m.totalSpaces, label: 'Espacios', highlight: false },
      { icon: 'calendar_month', value: m.totalBookings, label: 'Reservas', highlight: false },
      { icon: 'person_add', value: m.pendingHostRequests, label: 'Solic. host', highlight: m.pendingHostRequests > 0 },
      { icon: 'rate_review', value: m.pendingPublications, label: 'Pubs. pend.', highlight: m.pendingPublications > 0 },
      { icon: 'payments', value: `${m.totalRevenue} €`, label: 'Ingresos', highlight: false },
    ];
  });

  userColumns: AdminTableColumn<User>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'email', label: 'Email' },
    { key: 'roles', label: 'Roles' },
  ];

  spaceColumns: AdminTableColumn<SpaceModel>[] = [
    { key: 'name', label: 'Espacio' },
    { key: 'publicationStatus', label: 'Estado' },
    { key: 'dailyPrice', label: 'Precio/día' },
  ];

}