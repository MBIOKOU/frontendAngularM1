import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //Table des utilisateurs
  private users = [
    { login: 'admin', password: 'admin', role: 'admin' },
    { login: 'user', password: 'user', role: 'user' }
  ];
  
  private currentUser: { login: string, role: string } | null = null;


  //Méthode de connexion
  logIn(login: string, password: string): boolean {
    const user = this.users.find(u => u.login === login && u.password === password);
    if (user) {
      this.currentUser = { login: user.login, role: user.role };
      return true;
    }
    return false;
  }

  //Méthode de déconnexion
  logOut(): void {
    this.currentUser = null;
  }

  //Vérifie si l'utilisateur est connecté
  isLogged(): boolean {
    return this.currentUser !== null;
  }

  //Vérifie si l'utilisateur connecté est un admin
  isAdmin(): boolean {
    return this.currentUser?.role === 'admin';
  }

  // Méthode pour obtenir l'utilisateur actuel
  getCurrentUser(){
    return this.currentUser;
  }
  
}
