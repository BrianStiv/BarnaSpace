import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeMarketplace } from './home-marketplace';

describe('HomeMarketplace', () => {
  let component: HomeMarketplace;
  let fixture: ComponentFixture<HomeMarketplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMarketplace],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeMarketplace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
