import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpaceModel } from '../../../core/models/space.model';
import { AMENITY_ICONS, Amenity } from '../../../core/models/amenity.model';

@Component({
  selector: 'app-space-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './space-card.html',
})
export class SpaceCard {
  space = input.required<SpaceModel>();
  isFavorite = input<boolean>(false);
  favoriteClick = output<void>();

  amenityIcon(amenity: string) {
    return AMENITY_ICONS[amenity as Amenity] ?? { icon: 'check_circle', label: amenity };
  }
}