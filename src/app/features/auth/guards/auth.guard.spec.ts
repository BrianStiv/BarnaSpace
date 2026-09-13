import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { authGuard } from './auth.guard';
import { AuthService } from '../service/auth.service';

describe('AuthGuard', () => {
  function run(user: unknown): Promise<unknown> {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { currentUser$: of(user) } },
        { provide: Router, useValue: { url: '/marketplace/my-bookings', createUrlTree: vi.fn(() => 'REDIRECT') } },
      ],
    });

    return firstValueFrom(
      TestBed.runInInjectionContext(() => authGuard({} as any, {} as any)) as Observable<unknown>,
    );
  }

  it('allows a logged-in user', async () => {
    expect(await run({ uid: 'u1' })).toBe(true);
  });

  it('redirects to login when there is no user', async () => {
    expect(await run(null)).toBe('REDIRECT');
  });
});