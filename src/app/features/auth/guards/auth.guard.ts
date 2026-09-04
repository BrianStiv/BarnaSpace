import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    take(1),
    map((user) =>
      user
        ? true
        : router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: router.url } }),
    ),
  );
};