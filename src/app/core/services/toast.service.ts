import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private snackBar = inject(MatSnackBar);

  show(message: string, type: ToastType = 'info', duration = 3000) {
    this.snackBar.open(message, 'Cerrar', {
      duration,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['app-toast', `app-toast--${type}`],
    });
  }
}