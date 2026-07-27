import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SpaceForm } from '../../../../features/host/component/space-form/space-form';
import { SpacesService } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';


@Component({
  selector: 'app-become-host-wizard',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    SpaceForm,
  ],
  templateUrl: './become-host-wizard.page.html',
})
export class BecomeHostWizard {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private spacesService = inject(SpacesService);

  currentStep = 0;

  personalForm: FormGroup;
  fiscalForm: FormGroup;

  constructor() {
    this.personalForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.fiscalForm = this.fb.group({
      fiscalName: ['', Validators.required],
      nif: ['', Validators.required],
    });
  }

  nextStep() {
    if (this.currentStep === 0 && this.personalForm.invalid) return;
    if (this.currentStep === 1 && this.fiscalForm.invalid) return;

    this.currentStep++;
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  async onSpaceSubmit(spaceData: Omit<SpaceModel, 'id'>) {
    try {
      await this.spacesService.create(spaceData);
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.error('Become host error:', error);
    }
  }

  onCancel() {
    this.router.navigate(['/marketplace']);
  }
}