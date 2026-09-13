import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Auth } from '@angular/fire/auth';
import { SpaceForm } from './space-form';
import { GeocodingService } from '../../../../core/services/geocoding.service';

describe('SpaceForm', () => {
  let fixture: ComponentFixture<SpaceForm>;
  let component: SpaceForm;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: { currentUser: { uid: 'host1' } } },
        { provide: GeocodingService, useValue: { geocode: vi.fn() } },
      ],
    });

    fixture = TestBed.createComponent(SpaceForm);
    component = fixture.componentInstance;
  });

  it('is invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('is invalid when the daily price is below 1', () => {
    component.form.patchValue({ dailyPrice: 0 });
    expect(component.form.invalid).toBe(true);
  });

  it('is valid when all fields are filled', () => {
    component.form.setValue({
      name: 'Terraza',
      description: 'Un espacio amplio',
      dailyPrice: 100,
      capacity: 20,
      squareMeters: 50,
      address: 'Calle Falsa 1',
      zipCode: '08002',
      city: 'Barcelona',
      neighborhood: '',
      images: ['x.jpg'],
      categories: ['birthday_family'],
      amenities: [],
    });

    expect(component.form.valid).toBe(true);
  });
});