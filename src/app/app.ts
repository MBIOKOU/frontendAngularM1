import { Component, signal, OnInit} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Assignments } from './assignments/assignments';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { RouterOutlet, RouterLink } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {Router} from '@angular/router';
import {AuthService} from './shared/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatButtonModule, 
    MatToolbarModule, MatIconModule, MatSidenavModule, FormsModule, 
    MatListModule, RouterLink, MatSlideToggleModule, MatFormFieldModule, MatInputModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = "Application de gestion des assignments";
  auteur = 'Mourichidatou BIOKOU';
  opened = false;

  loginInput = '';
  passwordInput = '';
  loginError = '';

 constructor  (public authService:AuthService, private router:Router) {}
  ngOnInit(): void {
  }


 logout() {
    this.authService.logOut();
    console.log("Déconnecté");
    this.router.navigate(['/home']);
  }








  /*
  login() {
    if (!this.authService.isLogged()) {
      // Tentative de connexion
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
    } else {
      // Déconnexion
      this.authService.logOut();
      this.loginInput = '';
      this.passwordInput = '';
      console.log("Déconnecté");
      this.router.navigate(['/home']);
    }
  }
  
  */



  isLogged(): boolean {
    return this.authService.isLogged(); 
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
}


















  
  /*
  login() {
    if(!this.authService.loggedIn) {
      this.authService.logIn();
      console.log("Déconnecté");
    } else {
      this.authService.logOut();
      console.log("Connecté en tant qu'admin");
      this.router.navigate(['/home']);

    } 
  }
  */

