import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { adminGuard } from './admin.guard';
import { AuthService } from '../service/auth.service';

describe('AdminGuard', () => {
  function run(user: unknown): Promise<unknown> {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { currentUser$: of(user) } },
        { provide: Router, useValue: { createUrlTree: vi.fn(() => 'REDIRECT') } },
      ],
    });

    return firstValueFrom(
      TestBed.runInInjectionContext(() => adminGuard({} as any, {} as any)) as Observable<unknown>,
    );
  }

  it('allows an admin user', async () => {
    expect(await run({ roles: ['admin'] })).toBe(true);
  });

  it('redirects a non-admin user', async () => {
    expect(await run({ roles: ['client'] })).toBe('REDIRECT');
  });

  it('redirects when there is no user', async () => {
    expect(await run(null)).toBe('REDIRECT');
  });
});