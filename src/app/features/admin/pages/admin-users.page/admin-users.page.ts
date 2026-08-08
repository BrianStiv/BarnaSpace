import { Component, computed, inject, signal } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminTable, AdminTableColumn } from '../../component/admin-table/admin-table';
import { AdminDetailPanel, DetailSection } from '../../component/admin-detail-panel/admin-detail-panel';
import { AdminService } from '../../service/admin.service';
import { User } from '../../../../core/models/user.model';
import { AdminNavMenu } from '../../component/admin-nav-menu/admin-nav-menu';

type RoleFilter = 'all' | 'client' | 'host';

@Component({
  selector: 'app-admin-users.page',
  imports: [
    MatCardModule, MatIconModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatProgressSpinnerModule,
    AdminTable, AdminDetailPanel, AdminNavMenu,
  ],
  templateUrl: './admin-users.page.html',
})
export class AdminUsersPage {
  private adminService = inject(AdminService);

  usersResource = rxResource({ stream: () => this.adminService.getUsers() });

  search = signal('');
  roleFilter = signal<RoleFilter>('all');
  selectedUser = signal<User | null>(null);

  private debouncedSearch = toSignal(
    toObservable(this.search).pipe(debounceTime(300)),
    { initialValue: '' },
  );

  filteredUsers = computed(() => {
    const users = this.usersResource.value() ?? [];
    const term = (this.debouncedSearch() ?? '').trim().toLowerCase();
    const role = this.roleFilter();

    return users.filter((u) => {
      const matchesRole = role === 'all' || u.roles?.includes(role);
      const fullName = `${u.firstName} ${u.lastName}`.trim().toLowerCase();
      const matchesTerm =
        !term ||
        fullName.includes(term) ||
        u.email.toLowerCase().includes(term);
      return matchesRole && matchesTerm;
    });
  });

  userColumns: AdminTableColumn<User>[] = [
    {
      key: 'firstName',
      label: 'Nombre',
      format: (u) => `${u.firstName} ${u.lastName}`.trim(),
    },
    { key: 'email', label: 'Email' },
    { key: 'roles', label: 'Roles' },
  ];

  userSections = computed<DetailSection[]>(() => {
    const u = this.selectedUser();
    if (!u) return [];

    const sections: DetailSection[] = [
      {
        title: 'Perfil',
        fields: [
          { label: 'Nombre', value: u.firstName },
          { label: 'Apellidos', value: u.lastName },
          { label: 'Email', value: u.email },
          { label: 'Teléfono', value: u.phone },
          { label: 'Roles', value: u.roles, type: 'list' },
          { label: 'Estado host', value: u.hostStatus },
          { label: 'Creado', value: u.createdAt, type: 'date' },
        ],
      },
    ];

    if (u.hostData) {
      sections.push({
        title: 'Datos fiscales',
        fields: [
          { label: 'Tipo de entidad', value: u.hostData.entityType },
          { label: 'Nombre fiscal', value: u.hostData.fiscalName },
          { label: 'Tipo de documento', value: u.hostData.documentType },
          { label: 'Número de documento', value: u.hostData.documentNumber },
          { label: 'Nº licencia HUTTB', value: u.hostData.huttbLicenseNumber },
          { label: 'Referencia catastral', value: u.hostData.cadastralReference },
          { label: 'Certificado habitabilidad', value: u.hostData.habitabilityCertificate },
          { label: 'Dirección', value: u.hostData.address },
          { label: 'Ciudad', value: u.hostData.city },
          { label: 'Código postal', value: u.hostData.zipCode },
          { label: 'Nº licencia turística', value: u.hostData.tourismLicenseNumber },
          { label: 'Cuenta bancaria', value: u.hostData.bankAccount },
        ],
      });
    }

    sections.push({
      title: 'Favoritos',
      fields: [{ label: 'Espacios guardados', value: u.favorites, type: 'list' }],
    });

    sections.push({
      title: 'Reservas',
      fields: [],
    });

    return sections;
  });

  onRowSelect(user: User) {
    this.selectedUser.set(user);
  }
}