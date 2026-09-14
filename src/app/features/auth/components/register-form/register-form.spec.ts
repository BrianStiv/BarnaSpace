import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterForm } from './register-form';

describe('RegisterForm', () => {
  let fixture: ComponentFixture<RegisterForm>;
  let component: RegisterForm;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterForm);
    component = fixture.componentInstance;
  });

  it('is invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('is invalid with a short first name', () => {
    component.form.setValue({ firstName: 'A', lastName: 'López', email: 'a@b.com', password: '123456' });
    expect(component.form.invalid).toBe(true);
  });

  it('is valid with all fields', () => {
    component.form.setValue({ firstName: 'Ana', lastName: 'López', email: 'a@b.com', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('emits the registration data when submitted', () => {
    let emitted: any;
    component.register.subscribe((v) => (emitted = v));

    component.form.setValue({ firstName: 'Ana', lastName: 'López', email: 'a@b.com', password: '123456' });
    component.onSubmit();

    expect(emitted).toEqual({ firstName: 'Ana', lastName: 'López', email: 'a@b.com', password: '123456' });
  });
});