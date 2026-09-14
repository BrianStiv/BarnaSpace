import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpaceCard } from './space-card';

describe('SpaceCard', () => {
  function createCard(space: any): ComponentFixture<SpaceCard> {
    const fixture = TestBed.createComponent(SpaceCard);
    fixture.componentRef.setInput('space', space);
    fixture.detectChanges();
    return fixture;
  }

  const baseSpace = {
    name: 'Terraza',
    images: [],
    location: { neighborhood: 'Gràcia' },
    capacity: 20,
    squareMeters: 100,
    dailyPrice: 150,
    amenities: [],
  };

  it('shows the space name', () => {
    const fixture = createCard(baseSpace);
    expect(fixture.nativeElement.textContent).toContain('Terraza');
  });

  it('shows the neighborhood', () => {
    const fixture = createCard(baseSpace);
    expect(fixture.nativeElement.textContent).toContain('Gràcia');
  });

  it('shows the capacity', () => {
    const fixture = createCard(baseSpace);
    expect(fixture.nativeElement.textContent).toContain('20');
  });

  it('shows the Pet Friendly badge when applicable', () => {
    const fixture = createCard({ ...baseSpace, amenities: ['pet_friendly'] });
    expect(fixture.nativeElement.textContent).toContain('Pet Friendly');
  });

  it('does not show the Pet Friendly badge when not applicable', () => {
    const fixture = createCard({ ...baseSpace, amenities: [] });
    expect(fixture.nativeElement.textContent).not.toContain('Pet Friendly');
  });
});