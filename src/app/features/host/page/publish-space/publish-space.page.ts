import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SpaceForm } from '../../component/space-form/space-form';
import { SpacesService } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';

@Component({
  selector: 'app-publish-space',
  imports: [CommonModule, SpaceForm],
  templateUrl: './publish-space.page.html',
})
export class PublishSpace {
  private spacesService = inject(SpacesService);
  private router = inject(Router);

  async onSubmit(spaceData: Omit<SpaceModel, 'id'>) {
    try {
      await this.spacesService.create(spaceData);
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.error('Publish space error:', error);
    }
  }

  onCancel() {
    this.router.navigate(['/marketplace']);
  }

}
