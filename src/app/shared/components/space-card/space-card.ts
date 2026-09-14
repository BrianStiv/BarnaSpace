import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { SpaceModel } from '../../../core/models/space.model';

@Component({
  selector: 'app-space-card',
  imports: [CommonModule, MatIconModule],
  templateUrl: './space-card.html',
})
export class SpaceCard {
  space = input.required<SpaceModel>();
  isFavorite = input<boolean>(false);
  favoriteClick = output<void>();
}
