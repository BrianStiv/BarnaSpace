import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingsPage } from './admin-bookings.page';

describe('AdminBookingsPage', () => {
  let component: AdminBookingsPage;
  let fixture: ComponentFixture<AdminBookingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
