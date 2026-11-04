import { Component, inject, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs/operators';
import { firstValueFrom, of } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../../core/services/toast.service';
import { AMENITY_ICONS, Amenity } from '../../../../core/models/amenity.model';

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
    RouterLink
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
  private toast = inject(ToastService);
  private location = inject(Location);

  activeImage = signal(0);


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

  currentUser = toSignal(this.authService.currentUser$, { initialValue: null });

  date = signal('');
  guests = signal(1);
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
    this.location.back();
  }

  async onReserve(space: SpaceModel) {
    const selectedDate = this.date();

    if (!selectedDate) {
      this.toast.show('Selecciona la fecha de tu evento.');
      return;
    }

    const guests = Number(this.guests());
    const capacity = Number(space.capacity);

    if (guests > capacity) {
      this.toast.show(`El aforo máximo es de ${capacity} personas.`);
      return;
    }

    this.processing.set(true);

    try {
      const available = await this.bookingsService.checkAvailability(space.id!, selectedDate);

      if (!available) {
        this.toast.show('La fecha seleccionada no está disponible.');
        return;
      }

      await this.bookingsService.createBooking(space, selectedDate, guests);
      this.toast.show('Reserva enviada. Queda pendiente de aprobación.');
    } catch (error) {
      console.error('Booking error:', error);
      this.toast.show('Error al crear la reserva.');
    } finally {
      this.processing.set(false);
    }
  }

  selectImage(index: number) {
    this.activeImage.set(index);
  }

  prevImage(total: number) {
    this.activeImage.update((i) => (i - 1 + total) % total);
  }

  nextImage(total: number) {
    this.activeImage.update((i) => (i + 1) % total);
  }

  amenityIcon(amenity: Amenity) {
  return AMENITY_ICONS[amenity] ?? { icon: 'check_circle', label: amenity };
}
}