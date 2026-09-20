import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpacesService } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { SpaceCard } from '../../../../shared/components/space-card/space-card';

@Component({
  selector: 'app-neighborhood-carousel',
  imports: [
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SpaceCard,
  ],
  templateUrl: './neighborhood-carousel.html',
})
export class NeighborhoodCarousel {
  private router = inject(Router);
  private spacesService = inject(SpacesService);

  spaces = toSignal(this.spacesService.getPublished());

  groups = computed(() => {
    const list = this.spaces() ?? [];
    const byZone = new Map<string, SpaceModel[]>();

    for (const space of list) {
      const zone = space.location?.neighborhood?.trim() || 'Otros';
      const items = byZone.get(zone) ?? [];
      items.push(space);
      byZone.set(zone, items);
    }

    return [...byZone.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], 'es'))
      .map(([neighborhood, spaces]) => ({ neighborhood, spaces }));
  });

  goToDetail(space: SpaceModel) {
    this.router.navigate(['/marketplace/space', space.id]);
  }

  goToNeighborhood(neighborhood: string) {
    this.router.navigate(['/marketplace/results'], {
      queryParams: { neighborhood },
    });
  }
}