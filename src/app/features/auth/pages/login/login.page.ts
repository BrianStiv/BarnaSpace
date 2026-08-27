import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { MatIconModule} from '@angular/material/icon';
import { LoginForm } from '../../components/login-form/login-form';
import { LoginRequest } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-login',
  imports: [CommonModule,MatIconModule, MatButtonModule,LoginForm,RouterLink],
  templateUrl: './login.page.html',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  async onLogin(credentials: LoginRequest){
    try {
      await this.authService.login(credentials);
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
