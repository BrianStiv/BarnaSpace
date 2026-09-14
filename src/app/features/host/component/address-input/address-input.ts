import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


@Component({
  selector: 'app-address-input',
  imports: [FormsModule, MatInputModule, MatFormFieldModule],
  templateUrl: './address-input.html',
})
export class AddressInput {
  address = input<string>('');
  addressChange = output<string>();
  label = input<string>('Dirección completa');

}
