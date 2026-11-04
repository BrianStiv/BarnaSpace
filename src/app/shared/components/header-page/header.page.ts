import { Component } from '@angular/core';
import { MarketplaceNavMenu } from '../marketplace-nav-menu/marketplace-nav-menu';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-header-page',
  imports: [MarketplaceNavMenu,RouterLink],
  templateUrl: './header.page.html',
})
export class HeaderPage {}
