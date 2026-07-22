import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { RegisterForm } from '../../components/register-form/register-form';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, RouterLink, RegisterForm],
  templateUrl: './register.page.html',
})
export class RegisterPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  async onRegister(data: { name: string; email: string; password: string }) {
    try {
      await this.authService.register(data.email, data.password, data.name);
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.error('Register error:', error);
    }
  }
}
