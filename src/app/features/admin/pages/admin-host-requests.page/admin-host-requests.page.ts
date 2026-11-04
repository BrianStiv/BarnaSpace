import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminTable, AdminTableColumn } from '../../component/admin-table/admin-table';
import { AdminDetailPanel, DetailSection } from '../../component/admin-detail-panel/admin-detail-panel';
import { AdminService } from '../../service/admin.service';
import { User } from '../../../../core/models/user.model';
import { SpaceModel } from '../../../../core/models/space.model';
import { ToastService } from '../../../../core/services/toast.service';


@Component({
  selector: 'app-admin-host-requests.page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    AdminTable,
    AdminDetailPanel,
  ],
  templateUrl: './admin-host-requests.page.html',
})
export class AdminHostRequestsPage {
    private adminService = inject(AdminService);
    private toast = inject(ToastService);

  requestsResource = rxResource({ stream: () => this.adminService.getPendingHostRequests() });

  selectedUser = signal<User | null>(null);
  rejectionReason = signal('');
  processing = signal(false);
  feedbackMessage = signal<string | null>(null);

  requestColumns: AdminTableColumn<User>[] = [
    {
      key: 'firstName',
      label: 'Solicitante',
      format: (u) => `${u.firstName} ${u.lastName}`.trim(),
    }, 
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Teléfono' },
  ];

selectedSpaceResource = rxResource({
  params: () => this.selectedUser(),
  stream: ({ params }) => {
    if (!params) return of(undefined);
    return this.adminService.getSpaceByHostId(params.uid);
  },
});

  userSections = computed<DetailSection[]>(() => {
    const user = this.selectedUser();
    if (!user) return [];

    const sections: DetailSection[] = [
      {
        title: 'Datos personales',
        fields: [
          { label: 'Nombre', value: user.firstName },
          { label: 'Apellidos', value: user.lastName },
          { label: 'Email', value: user.email },
          { label: 'Teléfono', value: user.phone },
        ],
      },
    ];

    if (user.hostData) {
      sections.push({
        title: 'Datos fiscales',
        fields: [
          { label: 'Tipo de entidad', value: user.hostData.entityType },
          { label: 'Nombre fiscal', value: user.hostData.fiscalName },
          { label: 'Tipo de documento', value: user.hostData.documentType },
          { label: 'Número de documento', value: user.hostData.documentNumber },
          { label: 'Nº licencia HUTTB', value: user.hostData.huttbLicenseNumber },
          { label: 'Referencia catastral', value: user.hostData.cadastralReference },
          { label: 'Certificado habitabilidad', value: user.hostData.habitabilityCertificate },
          { label: 'Dirección', value: user.hostData.address },
          { label: 'Ciudad', value: user.hostData.city },
          { label: 'Código postal', value: user.hostData.zipCode },
          { label: 'Nº licencia turística', value: user.hostData.tourismLicenseNumber },
          { label: 'Cuenta bancaria', value: user.hostData.bankAccount },
        ],
      });
    }

    return sections;
  });

  spaceSections = computed<DetailSection[]>(() => {
    const space = this.selectedSpaceResource.value();
    if (!space) return [];

    return [
      {
        title: 'Espacio propuesto',
        fields: [
          { label: 'Nombre', value: space.name },
          { label: 'Descripción', value: space.description },
          { label: 'Barrio', value: space.location.neighborhood },
          { label: 'Capacidad', value: `${space.capacity} personas` },
          { label: 'Metros cuadrados', value: `${space.squareMeters} m²` },
          { label: 'Precio/día', value: `${space.dailyPrice} €` },
          { label: 'Estado', value: space.publicationStatus },
        ],
      },
    ];
  });

  detailSections = computed<DetailSection[]>(() => [
    ...this.userSections(),
    ...this.spaceSections(),
  ]);

  onRowSelect(user: User) {
    this.selectedUser.set(user);
  }

  private async handleApproval(action: 'approve' | 'reject') {
    const user = this.selectedUser();
    const space = this.selectedSpaceResource.value();

    if (!user || !space?.id) return;

    this.processing.set(true);
    this.feedbackMessage.set(null);

    try {
      if (action === 'approve') {
        await this.adminService.approveHostRequest(user.uid, space.id);
        this.toast.show('Solicitud aprobada correctamente.');
      } else {
        await this.adminService.rejectHostRequest(user.uid, space.id, this.rejectionReason());
        this.toast.show('Solicitud rechazada correctamente.');
      }

      this.selectedUser.set(null);
      this.rejectionReason.set('');
      this.requestsResource.reload();
    } catch (error) {
      console.error('Host request action error:', error);
      this.toast.show('Error al procesar la solicitud.');
    } finally {
      this.processing.set(false);
    }
  }

  onApprove() {
    this.handleApproval('approve');
  }

  onReject() {
    this.handleApproval('reject');
  }

}
