import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeHostWizard } from './become-host-wizard.page.';

describe('BecomeHostWizard', () => {
  let component: BecomeHostWizard;
  let fixture: ComponentFixture<BecomeHostWizard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeHostWizard],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeHostWizard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
