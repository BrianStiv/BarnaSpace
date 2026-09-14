import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Observable, of, firstValueFrom } from 'rxjs';
import { hostGuard } from './host.guard';
import { AuthService } from '../service/auth.service';

describe('HostGuard', () => {
  function run(user: unknown): Promise<unknown> {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { currentUser$: of(user) } },
        { provide: Router, useValue: { createUrlTree: vi.fn(() => 'REDIRECT') } },
      ],
    });

    return firstValueFrom(
      TestBed.runInInjectionContext(() => hostGuard({} as any, {} as any)) as Observable<unknown>,
    );
  }

  it('allows an approved host', async () => {
    expect(await run({ roles: ['host'], hostStatus: 'approved' })).toBe(true);
  });

  it('redirects a pending host', async () => {
    expect(await run({ roles: ['host'], hostStatus: 'pending' })).toBe('REDIRECT');
  });

  it('redirects a client', async () => {
    expect(await run({ roles: ['client'], hostStatus: 'not_applicable' })).toBe('REDIRECT');
  });
});