import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNavMenu } from './admin-nav-menu';

describe('AdminNavMenu', () => {
  let component: AdminNavMenu;
  let fixture: ComponentFixture<AdminNavMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavMenu],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminNavMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
