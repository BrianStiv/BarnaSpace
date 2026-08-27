import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketplaceNavMenu } from './marketplace-nav-menu';

describe('MarketplaceNavMenu', () => {
  let component: MarketplaceNavMenu;
  let fixture: ComponentFixture<MarketplaceNavMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketplaceNavMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketplaceNavMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
