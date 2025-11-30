import { Component, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatListModule} from '@angular/material/list';
import { AssignmentsService } from '../shared/assignments.service';
import { RouterLink } from '@angular/router';

import { DatePipe } from '@angular/common';
import { Rendu } from "../shared/rendu";
import { Nonrendu } from "../shared/nonrendu";
import { Assignment } from './assignment.model';



@Component({
  selector: 'app-assignments',
  imports: [DatePipe,Rendu,Nonrendu,MatInputModule,
    MatDatepickerModule,MatFormFieldModule,
    MatButtonModule, MatDividerModule, FormsModule, MatListModule,
    RouterLink],
  providers : [provideNativeDateAdapter()],
  templateUrl: './assignments.html',
  styleUrl: './assignments.css'
})
export class Assignments implements OnInit {
  titre = "Mon application sur les assignments";
  //ajoutActive = false;
  assignmentSelectionne ?: Assignment;
  assignments : Assignment[] = [];

  // Pour gérer la pagination
  page : number = 1;
  limit : number = 10
  totalDocs!: number;
  totalPages!: number;
  nextPage!: number;
  prevPage!: number
  hasPrevPage!: boolean;
  hasNextPage!: boolean;


  constructor(private assignmentsService : AssignmentsService) {}

  ngOnInit() {
    this.getAssignmentsPagine();
    
    // Pour activer le bouton après 2 secondes
    /*
    setTimeout(() => {
      this.ajoutActive = true;
    }, 2000);
    */
  }
  
  getAssignmentsPagine() {
    this.assignmentsService.getAssignmentsPagine(this.page, this.limit)
      .subscribe(
        data => {
          this.assignments = data.docs;
          this.totalDocs = data.totalDocs;
          this.totalPages = data.totalPages;
          this.nextPage = data.nextPage;
          this.prevPage = data.prevPage;
          this.hasPrevPage = data.hasPrevPage;
          this.hasNextPage = data.hasNextPage;
          console.log("Données paginées reçues");
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

}


    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    


