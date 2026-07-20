import { Component, inject } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { SpaceCategory, SPACE_CATEGORIES } from '../../../../core/models/space-category.model';

@Component({
  selector: 'app-home-marketplace',
  imports: [
    CommonModule,
    TitleCasePipe,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
  ],
  templateUrl: './home-marketplace.html',
})
export class HomeMarketplace {
  private router = inject(Router);

  categories = SPACE_CATEGORIES;
  selectedCategory: SpaceCategory | null = null;
  neighborhood = '';
  guests = '';
  when = '';

  selectCategory(category: SpaceCategory) {
    this.selectedCategory = category;
  }

  searchSpaces() {
    const queryParams: any = {};

    if (this.selectedCategory) {
      queryParams.category = this.selectedCategory;
    }

    if (this.neighborhood) {
      queryParams.neighborhood = this.neighborhood;
    }

    if (this.guests) {
      queryParams.guests = this.guests;
    }

    if (this.when) {
      queryParams.when = this.when;
    }

    this.router.navigate(['/marketplace/results'], {
      queryParams,
    });
  }
}
