import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginForm } from './login-form';

describe('LoginForm', () => {
  let fixture: ComponentFixture<LoginForm>;
  let component: LoginForm;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
  });

  it('is invalid when empty', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('is invalid with a bad email', () => {
    component.form.setValue({ email: 'not-an-email', password: '123456' });
    expect(component.form.invalid).toBe(true);
  });

  it('is invalid with a short password', () => {
    component.form.setValue({ email: 'a@b.com', password: '123' });
    expect(component.form.invalid).toBe(true);
  });

  it('is valid with a correct email and password', () => {
    component.form.setValue({ email: 'a@b.com', password: '123456' });
    expect(component.form.valid).toBe(true);
  });

  it('emits the credentials when submitted', () => {
    let emitted: any;
    component.login.subscribe((v) => (emitted = v));

    component.form.setValue({ email: 'a@b.com', password: '123456' });
    component.onSubmit();

    expect(emitted).toEqual({ email: 'a@b.com', password: '123456' });
  });

  it('does not emit when the form is invalid', () => {
    let emitted: any;
    component.login.subscribe((v) => (emitted = v));

    component.onSubmit();

    expect(emitted).toBeUndefined();
  });
});