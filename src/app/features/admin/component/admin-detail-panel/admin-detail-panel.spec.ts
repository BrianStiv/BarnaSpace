import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDetailPanel } from './admin-detail-panel';

describe('AdminDetailPanel', () => {
  let component: AdminDetailPanel;
  let fixture: ComponentFixture<AdminDetailPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDetailPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDetailPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
