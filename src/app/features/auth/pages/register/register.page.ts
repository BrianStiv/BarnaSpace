import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegisterForm } from '../../components/register-form/register-form';
import { AuthService } from '../../service/auth.service';
import { RegisterRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, RegisterForm],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  async onRegister(data: RegisterRequest) {
    try {
      await this.authService.register(data);
      this.authService.getHomeRoute().subscribe((route) => this.router.navigate([route]));
    } catch (error) {
      console.error('Register error:', error);
    }
  }
}