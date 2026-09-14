import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CloudinaryService } from '../../../../core/services/cloudinary.service';

@Component({
  selector: 'app-image-url-input',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './image-url-input.html',
})
export class ImageUrlInput {
  private cloudinaryService = inject(CloudinaryService);

  images = input<string[]>([]);
  imagesChange = output<string[]>();
  
  uploading = signal(false);
  error = signal<string | null>(null);

  async openUploader() {
    this.error.set(null);
    this.uploading.set(true);

    try {
      const uploadedUrls = await this.cloudinaryService.uploadImages();
      const current = this.images();
      this.imagesChange.emit([...current, ...uploadedUrls]);
    } catch (err) {
      console.error(err);
      this.error.set('Error al subir las imágenes.');
    } finally {
      this.uploading.set(false);
    }
  }

  removeImage(index: number) {
    const current = [...this.images()];
    current.splice(index, 1);
    this.imagesChange.emit(current);
  }

}
