import { Component } from '@angular/core';
import { CategorySearch } from '../../componet/category-search/category-search';
import { NeighborhoodCarousel } from '../../componet/neighborhood-carousel/neighborhood-carousel';


@Component({
  selector: 'app-home-marketplace',
  imports: [CategorySearch, NeighborhoodCarousel],
  templateUrl: './home-marketplace.html',
})
export class HomeMarketplace {}