import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPublicationsPage } from './admin-publications.page';

describe('AdminPublicationsPage', () => {
  let component: AdminPublicationsPage;
  let fixture: ComponentFixture<AdminPublicationsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPublicationsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPublicationsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
