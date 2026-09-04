import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../service/auth.service';

export const hostGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.currentUser$.pipe(
    take(1),
    map((user) =>
      user?.roles.includes('host') && user.hostStatus === 'approved'
        ? true
        : router.createUrlTree(['/marketplace']),
    ),
  );
};