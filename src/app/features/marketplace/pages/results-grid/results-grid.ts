import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, of } from 'rxjs';
import { SpacesService, SpaceFilters } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { SpaceCard } from '../../../../shared/components/space-card/space-card';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { MatIconModule } from '@angular/material/icon';
import { MarketplaceNavMenu } from '../../../../shared/components/marketplace-nav-menu/marketplace-nav-menu';

@Component({
  selector: 'app-results-grid',
  imports: [ MarketplaceNavMenu, CommonModule, MatProgressSpinnerModule, SpaceCard, EmptyState, MatIconModule],
  templateUrl: './results-grid.html',
})
export class ResultsGrid implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private spacesService = inject(SpacesService);

  spaces$: Observable<SpaceModel[]> = of([]);
  loading = true;

  ngOnInit() {
    const queryParams = this.route.snapshot.queryParams;

    const filters: SpaceFilters = {};

    if (queryParams['category']) {
      filters.category = queryParams['category'];
    }

    if (queryParams['neighborhood']) {
      filters.neighborhood = queryParams['neighborhood'];
    }

    if (queryParams['maxPrice']) {
      filters.maxPrice = Number(queryParams['maxPrice']);
    }

    if (queryParams['guests']) {
      filters.minCapacity = Number(queryParams['guests']);
    }

    if (queryParams['petFriendly']) {
      filters.petFriendly = queryParams['petFriendly'] === 'true';
    }

    this.spaces$ = this.spacesService.filterSpaces(filters);
    this.loading = false;
  }

  goToDetail(space: SpaceModel) {
    this.router.navigate(['/marketplace/space', space.id]);
  }
}
