import { Component, inject, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SpacesService, SpaceFilters } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { SpaceCard } from '../../../../shared/components/space-card/space-card';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MatIconModule } from '@angular/material/icon';
import { MarketplaceNavMenu } from '../../../../shared/components/marketplace-nav-menu/marketplace-nav-menu';

@Component({
  selector: 'app-results-grid',
  imports: [MarketplaceNavMenu, CommonModule, MatProgressSpinnerModule, SpaceCard, EmptyState, MatIconModule],
  templateUrl: './results-grid.html',
})
export class ResultsGrid {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private spacesService = inject(SpacesService);

  private filters$ = this.route.queryParams.pipe(
    map((params) => {
      const filters: SpaceFilters = {};

      if (params['category']) filters.category = params['category'];
      if (params['neighborhood']) filters.neighborhood = params['neighborhood'];
      if (params['maxPrice']) filters.maxPrice = Number(params['maxPrice']);
      if (params['guests']) filters.minCapacity = Number(params['guests']);
      if (params['petFriendly']) filters.petFriendly = params['petFriendly'] === 'true';

      return filters;
    }),
  );

  spaces: Signal<SpaceModel[] | undefined> = toSignal(
    this.filters$.pipe(
      switchMap((filters) => this.spacesService.filterSpaces(filters)),
    ),
  );

  goToDetail(space: SpaceModel) {
    this.router.navigate(['/marketplace/space', space.id]);
  }
}