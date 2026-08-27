import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { SpacesService } from '../../../../core/services/spaces.service';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { MarketplaceNavMenu } from '../../../../shared/components/marketplace-nav-menu/marketplace-nav-menu';

@Component({
  selector: 'app-space-detail',
  imports: [ MarketplaceNavMenu, CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  templateUrl: './space-detail.html',
})
export class SpaceDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private spacesService = inject(SpacesService);
  private favoritesService = inject(FavoritesService);

  space$: Observable<SpaceModel | undefined> = of(undefined);
  isFavorite$ = of(false);

  ngOnInit() {
    const spaceId = this.route.snapshot.paramMap.get('id');

    if (!spaceId) {
      this.router.navigate(['/marketplace']);
      return;
    }

    this.space$ = this.spacesService.getById(spaceId);
    this.isFavorite$ = this.favoritesService.isFavorite(spaceId);
  }

  toggleFavorite(space: SpaceModel) {
    this.favoritesService.toggleFavorite(space.id!).catch(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  goBack() {
    this.router.navigate(['/marketplace/results']);
  }
}
