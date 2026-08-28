import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../auth/service/auth.service';

interface NavLink {
  icon: string;
  label: string;
  path: string;
}

@Component({
  selector: 'app-admin-nav-menu',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './admin-nav-menu.html',
})
export class AdminNavMenu {
  private authService = inject(AuthService);
  private router = inject(Router);

  navOpen = signal(false);

  adminLinks: NavLink[] = [
    { icon: 'dashboard', label: 'Dashboard', path: '/admin/dashboard' },
    { icon: 'people', label: 'Usuarios', path: '/admin/users' },
    { icon: 'person_add', label: 'Solicitudes host', path: '/admin/host-requests' },
  ];

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