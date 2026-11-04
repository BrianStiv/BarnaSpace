import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpaceForm } from '../../component/space-form/space-form';
import { SpacesService } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-publish-space',
  imports: [CommonModule, SpaceForm],
  templateUrl: './publish-space.page.html',
})
export class PublishSpace {
  private spacesService = inject(SpacesService);
  private router = inject(Router);
  private toast = inject(ToastService);

  async onSubmit(spaceData: Omit<SpaceModel, 'id'>) {
    try {
      await this.spacesService.create(spaceData);
      this.toast.show('Espacio enviado. Queda pendiente de aprobación.', 'success');
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.error('Publish space error:', error);
      this.toast.show('Error al publicar el espacio.', 'error');
    }
  }

  onCancel() {
    this.router.navigate(['/marketplace']);
  }
}