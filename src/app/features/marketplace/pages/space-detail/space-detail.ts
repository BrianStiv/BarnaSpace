import { Component, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SpacesService } from '../../../../core/services/spaces.service';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { BookingsService } from '../../../../core/services/bookings.service';
import { SpaceModel } from '../../../../core/models/space.model';
import { AuthService } from '../../../auth/service/auth.service';
import { SpaceMap } from '../../../../shared/components/space-map/space-map';

@Component({
  selector: 'app-space-detail',
  imports: [
    FormsModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    SpaceMap,
  ],
  templateUrl: './space-detail.html',
})
export class SpaceDetail {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private spacesService = inject(SpacesService);
  private favoritesService = inject(FavoritesService);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);

  private spaceId$ = this.route.paramMap.pipe(map((params) => params.get('id')));

  space: Signal<SpaceModel | undefined> = toSignal(
    this.spaceId$.pipe(
      switchMap((id) => (id ? this.spacesService.getById(id) : of(undefined))),
    ),
  );

  isFavorite: Signal<boolean> = toSignal(
    this.spaceId$.pipe(
      switchMap((id) => (id ? this.favoritesService.isFavorite(id) : of(false))),
    ),
    { initialValue: false },
  );

  date = signal('');
  guests = signal(1);
  feedbackMessage = signal<string | null>(null);
  processing = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.router.navigate(['/marketplace']);
    }
  }

  toggleFavorite(space: SpaceModel) {
    this.favoritesService.toggleFavorite(space.id!).catch(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  goBack() {
    this.router.navigate(['/marketplace/results']);
  }

  async onReserve(space: SpaceModel) {
    const selectedDate = this.date();

    if (!selectedDate) {
      this.feedbackMessage.set('Selecciona la fecha de tu evento.');
      return;
    }

    const guests = Number(this.guests());
    const capacity = Number(space.capacity);

    if (guests > capacity) {
      this.feedbackMessage.set(`El aforo máximo es de ${capacity} personas.`);
      return;
    }

    const user = await firstValueFrom(this.authService.currentUser$);
    if (!user) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: `/marketplace/space/${space.id}` },
      });
      return;
    }

    this.processing.set(true);
    this.feedbackMessage.set(null);

    try {
      const available = await this.bookingsService.checkAvailability(space.id!, selectedDate);

      if (!available) {
        this.feedbackMessage.set('La fecha seleccionada no está disponible.');
        return;
      }

      await this.bookingsService.createBooking(space, selectedDate, guests);
      this.feedbackMessage.set('Reserva enviada. Queda pendiente de aprobación.');
    } catch (error) {
      console.error('Booking error:', error);
      this.feedbackMessage.set('Error al crear la reserva.');
    } finally {
      this.processing.set(false);
    }
  }
}