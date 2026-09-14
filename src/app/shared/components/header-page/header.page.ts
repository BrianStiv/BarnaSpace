import { Component } from '@angular/core';
import { MarketplaceNavMenu } from '../marketplace-nav-menu/marketplace-nav-menu';

@Component({
  selector: 'app-header-page',
  imports: [MarketplaceNavMenu],
  templateUrl: './header.page.html',
})
export class HeaderPage {}
