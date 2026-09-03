import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostPanelPage } from './host-panel.page';

describe('HostPanelPage', () => {
  let component: HostPanelPage;
  let fixture: ComponentFixture<HostPanelPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostPanelPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HostPanelPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
