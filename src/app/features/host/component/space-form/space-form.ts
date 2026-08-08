import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { AddressInput } from '../address-input/address-input';
import { ImageUrlInput } from '../image-url-input/image-url-input';
import { SpaceModel } from '../../../../core/models/space.model';
import { SpaceCategory,SPACE_CATEGORIES } from '../../../../core/models/space-category.model';
import { AMENITIES } from '../../../../core/models/amenity.model';
import { DynamicField, DynamicFieldConfig } from '../../../../shared/components/dynamic-field/dynamic-field';


@Component({
  selector: 'app-space-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    AddressInput,
    ImageUrlInput,
    DynamicField,
  ],
  templateUrl: './space-form.html',
})
export class SpaceForm {
  submit = output<Omit<SpaceModel, 'id'>>();
  cancel = output<void>();
  initialData = input<Partial<SpaceModel> | null>(null);
  submitLabel = input<string>('Publicar espacio');

  categories = SPACE_CATEGORIES;
  amenities = AMENITIES;

    simpleFields: DynamicFieldConfig[] = [
    { name: 'name', label: 'Nombre completo', type: 'text', required: true },
    { name: 'description', label: 'Descripción', type: 'textarea', required: true },
    { name: 'dailyPrice', label: 'Precio por día (€)', type: 'number', required: true, min: 1 },
    { name: 'capacity', label: 'Aforo', type: 'number', required: true, min: 1 },
    { name: 'squareMeters', label: 'Metros cuadrados', type: 'number', required: true, min: 1 },
  ];


  form: FormGroup;

  constructor(private fb: FormBuilder) {
    const initial = this.initialData();

    this.form = this.fb.group({
      name: [initial?.name ?? '', Validators.required],
      description: [initial?.description ?? '', Validators.required],
      dailyPrice: [initial?.dailyPrice ?? 0, [Validators.required, Validators.min(1)]],
      capacity: [initial?.capacity ?? 0, [Validators.required, Validators.min(1)]],
      squareMeters: [initial?.squareMeters ?? 0, [Validators.required, Validators.min(1)]],
      address: [initial?.location?.fullAddress ?? '', Validators.required],
      images: [initial?.images ?? [] as string[], [Validators.required, Validators.minLength(1)]],
      categories: [initial?.categories ?? [] as string[], Validators.required],
      amenities: [initial?.amenities ?? [] as string[]],
    });
  }

  toggleCategory(category: string) {
    const current = [...this.form.value.categories];
    const index = current.indexOf(category);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(category);
    }

    this.form.patchValue({ categories: current });
  }

  toggleAmenity(amenity: string) {
    const current = [...this.form.value.amenities];
    const index = current.indexOf(amenity);

    if (index >= 0) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }

    this.form.patchValue({ amenities: current });
  }

  isSelected(value: string, controlName: string): boolean {
    return this.form.value[controlName].includes(value);
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const spaceData: Omit<SpaceModel, 'id'> = {
      name: formValue.name,
      description: formValue.description,
      dailyPrice: formValue.dailyPrice,
      capacity: formValue.capacity,
      squareMeters: formValue.squareMeters,
      location: {
        fullAddress: formValue.address,
        neighborhood: '',
        city: 'Barcelona',
        province: 'Barcelona',
        autonomousCommunity: 'Cataluña',
        zipCode: '',
        lat: 0,
        lon: 0,
      },
      categories: formValue.categories,
      amenities: formValue.amenities,
      images: formValue.images,
      blockedDates: [],
      hostId: 'current_user_id',
      publicationStatus: 'pending_approval',
    };

    this.submit.emit(spaceData);
  }
}
