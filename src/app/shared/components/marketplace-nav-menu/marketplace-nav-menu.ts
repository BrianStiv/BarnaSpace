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

  if (!u) {
    return [
      { icon: 'home', label: 'Marketplace', path: '/marketplace' },
      { icon: 'login', label: 'Iniciar sesión', path: '/auth/login' },
    ];
  }

  if (u.roles.includes('admin')) {
    return [
      { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
      { icon: 'people', label: 'Usuarios', path: '/admin/users' },
      { icon: 'person_add', label: 'Solicitudes host', path: '/admin/host-requests' },
      { icon: 'article', label: 'Publicaciones', path: '/admin/publications' },
      { icon: 'event', label: 'Reservas', path: '/admin/bookings' },
    ];
  }

  const clientLinks: NavLink[] = [
    { icon: 'home', label: 'Marketplace', path: '/marketplace' },
    { icon: 'person', label: 'Mi perfil', path: '/marketplace' },
    { icon: 'favorite', label: 'Favoritos', path: '/marketplace' },
    { icon: 'event', label: 'Mis reservas', path: '/marketplace/my-bookings' },
  ];

  if (u.roles.includes('host')) {
    return [
      ...clientLinks,
      { icon: 'add_circle', label: 'Publicar espacio', path: '/host/publish' },
      { icon: 'dashboard', label: 'Panel de anfitrión', path: '/host/panel' },
    ];
  }

  return [
    ...clientLinks,
    { icon: 'handshake', label: 'Ser anfitrión', path: '/marketplace/become-host' },
  ];
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