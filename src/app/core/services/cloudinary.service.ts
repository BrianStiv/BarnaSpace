import { Injectable } from '@angular/core';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private cloudName = environment.cloudinaryCloudName;
  private uploadPreset = environment.cloudinaryUploadPreset;

  uploadImages(): Promise<string[]> {
    return new Promise((resolve) => {
      const uploaded: string[] = [];

      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: this.cloudName,
          uploadPreset: this.uploadPreset,
          multiple: true,
          maxFiles: 10,
        },
        (error, result) => {
          if (error) {
            console.error('Error al subir a Cloudinary', error);
            return;
          }
          if (result?.event === 'success') {
            uploaded.push(result.info!.secure_url);
          }
          if (result?.event === 'close') {
            resolve(uploaded);
          }
        },
      );

      widget.open();
    });
  }
}