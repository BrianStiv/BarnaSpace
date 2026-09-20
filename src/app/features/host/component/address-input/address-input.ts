import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';


@Component({
  selector: 'app-address-input',
  imports: [FormsModule, MatInputModule, MatFormFieldModule,MatIcon],
  templateUrl: './address-input.html',
})
export class AddressInput {
  address = input<string>('');
  addressChange = output<string>();
  label = input<string>('Dirección completa');

}
