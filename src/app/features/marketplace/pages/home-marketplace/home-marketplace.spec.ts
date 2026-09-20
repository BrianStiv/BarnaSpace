import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { HomeMarketplace } from './home-marketplace';
import { SpacesService } from '../../../../core/services/spaces.service';

describe('HomeMarketplace', () => {
  let component: HomeMarketplace;
  let fixture: ComponentFixture<HomeMarketplace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeMarketplace],
      providers: [
        provideRouter([]),
        { provide: SpacesService, useValue: { getPublished: () => of([]) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeMarketplace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});