import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishSpace } from './publish-space.page';

describe('PublishSpace', () => {
  let component: PublishSpace;
  let fixture: ComponentFixture<PublishSpace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishSpace],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishSpace);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
