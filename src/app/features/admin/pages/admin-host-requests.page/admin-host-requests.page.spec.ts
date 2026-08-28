import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHostRequestsPage } from './admin-host-requests.page';

describe('AdminHostRequestsPage', () => {
  let component: AdminHostRequestsPage;
  let fixture: ComponentFixture<AdminHostRequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminHostRequestsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHostRequestsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
