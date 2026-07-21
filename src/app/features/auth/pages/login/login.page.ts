import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin(credentials: { email: string; password: string }) {
    try {
      await this.authService.login(credentials.email, credentials.password);
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  async onGoogleLogin() {
    try{
      await this.authService.loginWithGoogle();
      this.router.navigate(['/marketplace']);
    } catch (error) {
      console.log(error);
      console.error('Google Login error:', error);
    }
  }

}
