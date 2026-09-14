import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { DynamicField } from './dynamic-field';

describe('DynamicField', () => {
  function createField(field: any, form: FormGroup): ComponentFixture<DynamicField> {
    const fixture = TestBed.createComponent(DynamicField);
    fixture.componentRef.setInput('field', field);
    fixture.componentRef.setInput('form', form);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the field label', () => {
    const form = new FormGroup({ name: new FormControl('') });
    const fixture = createField({ name: 'name', label: 'Nombre completo', type: 'text' }, form);

    expect(fixture.nativeElement.textContent).toContain('Nombre completo');
  });

  it('renders an input for text type', () => {
    const form = new FormGroup({ name: new FormControl('') });
    const fixture = createField({ name: 'name', label: 'Nombre', type: 'text' }, form);

    expect(fixture.nativeElement.querySelector('input')).toBeTruthy();
  });

  it('renders a textarea for textarea type', () => {
    const form = new FormGroup({ description: new FormControl('') });
    const fixture = createField({ name: 'description', label: 'Descripción', type: 'textarea' }, form);

    expect(fixture.nativeElement.querySelector('textarea')).toBeTruthy();
  });
});