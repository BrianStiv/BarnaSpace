import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-image-url-input',
  imports: [ CommonModule, FormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule ],
  templateUrl: './image-url-input.html',
})
export class ImageUrlInput {
  images = input<string[]>([]);
  imagesChange = output<string[]>();
  newImageUrl = '';

  addImage() {
    const trimmed = this.newImageUrl.trim();
    if (!trimmed) return;

    const current = this.images();
    this.imagesChange.emit([...current, trimmed]);
    this.newImageUrl = '';
  }

  removeImage(index: number) {
    const current = [...this.images()];
    current.splice(index, 1);
    this.imagesChange.emit(current);
  }

}
