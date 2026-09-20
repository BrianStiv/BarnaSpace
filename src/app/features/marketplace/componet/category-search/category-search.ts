import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { SpaceCategory, SPACE_CATEGORY_CARDS } from '../../../../core/models/space-category.model';

@Component({
  selector: 'app-category-search',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './category-search.html',
})
export class CategorySearch {
  private router = inject(Router);

  categories = SPACE_CATEGORY_CARDS;
  selectedCategory = signal<SpaceCategory | null>(null);
  neighborhood = signal('');
  guests = signal('');
  when = signal('');

  selectCategory(category: SpaceCategory) {
    this.selectedCategory.update((current) =>
      current === category ? null : category,
    );
  }

  searchSpaces() {
    const queryParams: any = {};

    if (this.selectedCategory()) {
      queryParams.category = this.selectedCategory();
    }

    if (this.neighborhood()) {
      queryParams.neighborhood = this.neighborhood();
    }

    if (this.guests()) {
      queryParams.guests = this.guests();
    }

    if (this.when()) {
      queryParams.when = this.when();
    }

    this.router.navigate(['/marketplace/results'], { queryParams });
  }
}