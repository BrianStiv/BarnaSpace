import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatHint } from '@angular/material/form-field';

export interface DynamicFieldConfig {
  name: string;
  label: string;
  type: 'text' | 'number' | 'tel' | 'email' | 'textarea';
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  placeholder?: string;
  hint?: string;
  maxLength?: number;
}

@Component({
  selector: 'app-dynamic-field',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatError, MatHint],
  templateUrl: './dynamic-field.html',
})
export class DynamicField {
  field = input.required<DynamicFieldConfig>();
  form = input.required<FormGroup>();

  control = computed(() => this.form().get(this.field().name) as FormControl | null);
}