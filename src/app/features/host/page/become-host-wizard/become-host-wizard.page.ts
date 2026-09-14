import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { SpaceForm } from '../../component/space-form/space-form';
import { SpacesService } from '../../../../core/services/spaces.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { DynamicField, DynamicFieldConfig } from '../../../../shared/components/dynamic-field/dynamic-field';
import { HostService } from '../../../../core/services/host.service';

@Component({
  selector: 'app-become-host-wizard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    SpaceForm,
    DynamicField,
  ],
  templateUrl: './become-host-wizard.page.html',
})
export class BecomeHostWizard {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private spacesService = inject(SpacesService);
  private hostService = inject(HostService);

  currentStep = 0;

  personalFields: DynamicFieldConfig[] = [
    { name: 'firstName', label: 'Nombre', type: 'text', required: true },
    { name: 'lastName', label: 'Apellidos', type: 'text', required: true },
    { name: 'phone', label: 'Teléfono', type: 'tel', required: true },
  ];

  fiscalSimpleFields: DynamicFieldConfig[] = [
    { name: 'fiscalName', label: 'Nombre fiscal / Razón social', type: 'text', required: true },
    { name: 'documentNumber', label: 'Número de documento', type: 'text', required: true },
    { name: 'huttbLicenseNumber', label: 'Nº licencia HUTTB', type: 'text', required: true },
    { name: 'cadastralReference', label: 'Referencia catastral', type: 'text', required: true },
    { name: 'habitabilityCertificate', label: 'Certificado habitabilidad', type: 'text', required: true },
    { name: 'address', label: 'Dirección fiscal', type: 'text', required: true },
    { name: 'city', label: 'Ciudad', type: 'text', required: true },
    { name: 'zipCode', label: 'Código postal', type: 'number', required: true, min: 1 },
    { name: 'tourismLicenseNumber', label: 'Nº licencia turística (opcional)', type: 'text' },
    { name: 'bankAccount', label: 'Cuenta bancaria (IBAN)', type: 'text', required: true },
  ];

  personalForm: FormGroup;
  fiscalForm: FormGroup;

  constructor() {
    this.personalForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
    });

    this.fiscalForm = this.fb.group({
      entityType: ['', Validators.required],
      fiscalName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
      huttbLicenseNumber: ['', Validators.required],
      cadastralReference: ['', Validators.required],
      habitabilityCertificate: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: [0, [Validators.required, Validators.min(1)]],
      tourismLicenseNumber: [''],
      bankAccount: ['', Validators.required],
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
      const uid = await this.hostService.applyForHost({
        firstName: this.personalForm.value.firstName,
        lastName: this.personalForm.value.lastName,
        phone: this.personalForm.value.phone,
        hostData: {
          entityType: this.fiscalForm.value.entityType,
          fiscalName: this.fiscalForm.value.fiscalName,
          documentType: this.fiscalForm.value.documentType,
          documentNumber: this.fiscalForm.value.documentNumber,
          huttbLicenseNumber: this.fiscalForm.value.huttbLicenseNumber,
          cadastralReference: this.fiscalForm.value.cadastralReference,
          habitabilityCertificate: this.fiscalForm.value.habitabilityCertificate,
          address: this.fiscalForm.value.address,
          city: this.fiscalForm.value.city,
          zipCode: this.fiscalForm.value.zipCode,
          tourismLicenseNumber: this.fiscalForm.value.tourismLicenseNumber,
          bankAccount: this.fiscalForm.value.bankAccount,
        },
      });

      await this.spacesService.create({ ...spaceData, hostId: uid });
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.error('Become host error:', error);
    }
  }

  onCancel() {
    this.router.navigate(['/marketplace']);
  }
}