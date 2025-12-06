import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginComponent {
  loginInput = '';
  passwordInput = '';
  loginError = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    const success = this.authService.logIn(this.loginInput, this.passwordInput);
    if (success) {
      this.loginError = '';
      const user = this.authService.getCurrentUser();
      console.log(`Connecté en tant que ${user?.role}: ${user?.login}`);
      this.router.navigate(['/home']);
    } else {
      this.loginError = 'Login ou mot de passe incorrect';
      console.log("Échec de connexion");
    }
  }
}