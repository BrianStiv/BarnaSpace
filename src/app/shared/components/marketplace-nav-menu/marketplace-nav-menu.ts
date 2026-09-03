import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../features/auth/service/auth.service';

interface NavLink {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-marketplace-nav-menu',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
  ],
  templateUrl: './marketplace-nav-menu.html',
})
export class MarketplaceNavMenu {
  private authService = inject(AuthService);
  private router = inject(Router);

  navOpen = signal(false);
  user = toSignal(this.authService.currentUser$, { initialValue: null });

  links = computed<NavLink[]>(() => {
    const u = this.user();

    const base: NavLink[] = [
      { icon: 'home', label: 'Marketplace', path: '/marketplace' },
    ];

    const authenticatedLinks: NavLink[] = [
      { icon: 'person', label: 'Mi perfil', path: '/marketplace' },
      { icon: 'favorite', label: 'Favoritos', path: '/marketplace' },
    ];

    const hostLinks: NavLink[] = [
      { icon: 'add_circle', label: 'Publicar espacio', path: '/host/publish' },
      { icon: 'bashboard', label: 'Panel de anfitrion', path: '/host/panel' },
      { icon: 'event', label: 'Mis reservas', path: '/marketplace' },
    ];

    if (!u) {
      return [...base, { icon: 'login', label: 'Iniciar sesión', path: '/auth/login' }];
    }

    if (u.roles.includes('host')) {
      return [...base, ...authenticatedLinks, ...hostLinks];
    }

    return [...base, ...authenticatedLinks];
  });

  toggle() {
    this.navOpen.update(v => !v);
  }

  close() {
    this.navOpen.set(false);
  }

  async onLogout() {
    this.close();
    await this.authService.logout();
    this.router.navigate(['/marketplace']);
  }
}
