import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatListModule} from '@angular/material/list';
import { AssignmentsService } from '../shared/assignments.service';
import { ActivatedRoute, Router, RouterLink, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';


import { DatePipe } from '@angular/common';
import { Rendu } from "../shared/rendu";
import { Nonrendu } from "../shared/nonrendu";
import { Assignment } from './assignment.model';
import { AuthService } from '../shared/auth.service';
import { EnRetard } from '../shared/enretard';


@Component({
  selector: 'app-assignments',
  standalone: true,
  
  imports: [DatePipe,Rendu,Nonrendu,EnRetard,MatInputModule,
    MatDatepickerModule,MatFormFieldModule,
    MatButtonModule, MatDividerModule, FormsModule, MatListModule,
    RouterLink, MatIconModule, CommonModule, MatSelectModule],
  providers : [provideNativeDateAdapter()],
  templateUrl: './assignments.html',
  styleUrl: './assignments.css'
})
export class Assignments implements OnInit, OnDestroy {
  //ajoutActive = false;
  assignmentSelectionne ?: Assignment;
  assignments : Assignment[] = [];
  filtreRendu?: boolean; 
  filtreEnRetard: boolean = false;

  // Pour gérer la pagination
  page : number = 1;
  limit : number = 6;
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number
  hasPrevPage!: boolean;
  hasNextPage!: boolean;

  private routerSubscription ?: Subscription;

  constructor(
    private assignmentsService : AssignmentsService,
    private router: Router, 
    private route : ActivatedRoute,
    private authService : AuthService
  ) {}

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  //Avant modif 
  ngOnInit() {
   // Détecte la route actuelle pour appliquer le bon filtre
    this.route.url.subscribe(segments => {
        const path = segments[0]?.path || 'home';
        console.log("Route détectée:", path);
        
        if (path === 'rendus') {
            this.filtreRendu = true;
            this.filtreEnRetard = false;
        } else if (path === 'non-rendus') {
            this.filtreRendu = false;
            this.filtreEnRetard = false;
        } else if (path === 'en-retard') {
            this.filtreRendu = undefined;
            this.filtreEnRetard = true;
        } else {
            this.filtreRendu = undefined;
            this.filtreEnRetard = false;
        }
        
        this.page = 1; // Réinitialiser à la page 1
        this.getAssignmentsPagine();
    });
    
    // Écoute les événements de navigation
    this.routerSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
            console.log("Navigation détectée vers:", event.urlAfterRedirects);
            
            // Détermine le filtre en fonction de l'URL
            if (event.urlAfterRedirects.includes('/rendus')) {
                this.filtreRendu = true;
                this.filtreEnRetard = false;
                this.page = 1;
                this.getAssignmentsPagine();
            } else if (event.urlAfterRedirects.includes('/non-rendus')) {
                this.filtreRendu = false;
                this.filtreEnRetard = false;
                this.page = 1;
                this.getAssignmentsPagine();
            } else if (event.urlAfterRedirects.includes('/en-retard')) {
                this.filtreRendu = undefined;
                this.filtreEnRetard = true;
                this.page = 1;
                this.getAssignmentsPagine();
            } else if (event.urlAfterRedirects === '/home' || event.urlAfterRedirects === '/') {
                this.filtreRendu = undefined;
                this.filtreEnRetard = false;
                this.page = 1;
                this.getAssignmentsPagine();
            }
        });
  }

  ngOnDestroy() {
    // Nettoie la souscription
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }



  getAssignmentsPagine() {
    this.assignmentsService.getAssignmentsPagineFiltre(this.page, this.limit, this.filtreRendu, this.filtreEnRetard)
        .subscribe(
            data => {
                this.assignments = [...data.docs];
                this.totalDocs = data.totalDocs;
                this.totalPages = data.totalPages;
                this.nextPage = data.nextPage;
                this.prevPage = data.prevPage;
                this.hasPrevPage = data.hasPrevPage;
                this.hasNextPage = data.hasNextPage;
                console.log("Données paginées reçues avec filtre:", this.filtreRendu, "enRetard:", this.filtreEnRetard);
            }
        );
  }

  // Méthode de navigation entre les pages
  premierePage() {
    this.page = 1;
    this.getAssignmentsPagine();
  }

  pagePrecedente() {
    if (this.hasPrevPage) {
      this.page = this.prevPage;
      this.getAssignmentsPagine();
    }
  }

  pageSuivante() {
    if (this.hasNextPage) {
      this.page = this.nextPage;
      this.getAssignmentsPagine();
    }
  }

  dernierePage() {
    this.page = this.totalPages;
    this.getAssignmentsPagine();
  }

  
  // Clic sur un assignment de la liste
  assignmentClique(assignment: Assignment) {
      console.log("Assignment cliqué : " + assignment.nom);
      this.assignmentSelectionne = assignment;
  }  

  getAssignments() {
    this.assignmentsService.getAssignments()
      .subscribe(assignments => 
        this.assignments = assignments
      );
  }
  
  peuplerBD() {
    this.assignmentsService.peuplerBDavecForkJoin()
      .subscribe({
        next: () => {
          console.log("LA BD A ETE PEUPLEE, TOUS LES ASSIGNMENTS AJOUTES, ON RE-AFFICHE LA LISTE");
          window.location.reload();
        },
        error: (err) => console.error('Erreur de peuplement BD:', err)
      });
 }

  // Envoyer un message au père pour supprimer l'assignment
  onDeleteAssignment(assignmentToDelete: Assignment) {
     this.assignmentsService.deleteAssignment(assignmentToDelete)
      .subscribe(message => {
        console.log("Assignment supprimé avec succès");
      });
  }
  
  // Méthode estEnRetard
  estEnRetard(assignment: Assignment): boolean {
    const today = new Date();
    const dateRendu = new Date(assignment.dateDeRendu);
    today.setHours(0, 0, 0, 0);
    dateRendu.setHours(0, 0, 0, 0);
    return !assignment.rendu && dateRendu < today;
}


}


    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


