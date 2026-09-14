import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AdminTable, AdminTableColumn } from '../../component/admin-table/admin-table';
import { AdminDetailPanel, DetailSection } from '../../component/admin-detail-panel/admin-detail-panel';
import { AdminService } from '../../service/admin.service';
import { SpaceModel, PublicationStatus } from '../../../../core/models/space.model';


@Component({
  selector: 'app-admin-publications.page',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    AdminTable,
    AdminDetailPanel,
  ],
  templateUrl: './admin-publications.page.html',
})
export class AdminPublicationsPage {
  private adminService = inject(AdminService);

  tabStatuses: PublicationStatus[] = ['pending_approval', 'published', 'rejected', 'deactivated'];

  activeStatus = signal<PublicationStatus>('pending_approval');

  publicationsResource = rxResource({
    params: () => this.activeStatus(),
    stream: ({ params }) => this.adminService.getSpacesByStatus(params),
  });

  selectedSpace = signal<SpaceModel | null>(null);
  rejectionReason = signal('');
  processing = signal(false);
  feedbackMessage = signal<string | null>(null);

  publicationColumns: AdminTableColumn<SpaceModel>[] = [
    { key: 'name', label: 'Nombre' },
    { key: 'dailyPrice', label: 'Precio/día' },
    {
      key: 'location',
      label: 'Barrio',
      format: (space) => space.location.neighborhood,
    },
  ];

  detailSections = computed<DetailSection[]>(() => {
    const space = this.selectedSpace();
    if (!space) return [];

    return [
      {
        title: 'Información del espacio',
        fields: [
          { label: 'Nombre', value: space.name },
          { label: 'Descripción', value: space.description },
          { label: 'Dirección', value: space.location.fullAddress },
          { label: 'Barrio', value: space.location.neighborhood },
          { label: 'Capacidad', value: `${space.capacity} personas` },
          { label: 'Metros cuadrados', value: `${space.squareMeters} m²` },
          { label: 'Precio por día', value: `${space.dailyPrice} €` },
          { label: 'Categorías', value: space.categories, type: 'list' },
          { label: 'Servicios', value: space.amenities, type: 'list' },
          { label: 'Estado', value: space.publicationStatus },
          { label: 'Motivo de rechazo', value: space.rejectionReason ?? '—' },
        ],
      },
    ];
  });

  onTabChange(status: PublicationStatus) {
    this.activeStatus.set(status);
    this.selectedSpace.set(null);
    this.feedbackMessage.set(null);
  }

  onRowSelect(space: SpaceModel) {
    this.selectedSpace.set(space);
    this.feedbackMessage.set(null);
  }

  private async handleAction(action: 'approve' | 'reject' | 'deactivate') {
    const space = this.selectedSpace();
    if (!space?.id) return;

    this.processing.set(true);
    this.feedbackMessage.set(null);

    try {
      if (action === 'approve') {
        await this.adminService.approvePublication(space.id);
        this.feedbackMessage.set('Publicación aprobada correctamente.');
      } else if (action === 'reject') {
        await this.adminService.rejectPublication(space.id, this.rejectionReason());
        this.feedbackMessage.set('Publicación rechazada correctamente.');
      } else {
        await this.adminService.deactivatePublication(space.id);
        this.feedbackMessage.set('Publicación desactivada correctamente.');
      }

      this.selectedSpace.set(null);
      this.rejectionReason.set('');
      this.publicationsResource.reload();
    } catch (error) {
      console.error('Publication action error:', error);
      this.feedbackMessage.set('Error al procesar la publicación.');
    } finally {
      this.processing.set(false);
    }
  }

  onApprove() {
    this.handleAction('approve');
  }

  onReject() {
    this.handleAction('reject');
  }

  onDeactivate() {
    this.handleAction('deactivate');
  }
}