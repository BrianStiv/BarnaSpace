import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageUrlInput } from './image-url-input';

describe('ImageUrlInput', () => {
  let component: ImageUrlInput;
  let fixture: ComponentFixture<ImageUrlInput>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageUrlInput],
    }).compileComponents();

    fixture = TestBed.createComponent(ImageUrlInput);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
