import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [DatePipe,MatCardModule,MatCheckboxModule,
    MatButtonModule, CommonModule, MatIconModule, MatChipsModule],
  templateUrl: './assignment-detail.html',
  styleUrl: './assignment-detail.css'
})

export class AssignmentDetail implements OnInit {
  
  //formVisible = false;

  //@Input() 
  assignmentTransmis ?: Assignment;

  @Output() deleteAssignment = new EventEmitter<Assignment>();

  constructor(private assignmentsService : AssignmentsService,
              private route : ActivatedRoute,
              private router: Router,
              private authService : AuthService) {}

  ngOnInit(): void {
    this.getAssignment();

    console.log('isLogged:', this.isLogged());
    console.log('isAdmin:', this.isAdmin());
    console.log('currentUser:', this.authService.getCurrentUser());
  
  }

  getAssignment() {
    const _id = this.route.snapshot.params['_id'];

    console.log("QUERY PARAMS : ");
    console.log(this.route.snapshot.queryParams);
    console.log("FRAGMENTS : ");
    console.log(this.route.snapshot.fragment);

    this.assignmentsService.getAssignment(_id)
    .subscribe(a => {
      this.assignmentTransmis = a;
    } );

  }

  onAssignmentRendu() {
    if(this.assignmentTransmis) {
      this.assignmentTransmis.rendu = 
               !this.assignmentTransmis.rendu;

      this.assignmentsService.updateAssignment(this.assignmentTransmis)
      .subscribe(message => {
        console.log(message);
        this.router.navigate(['/home']);
      });
    }
  }

  onDeleteAssignment() {
    console.log('onDeleteAssignment');
    console.log('=== DÉBUT onDeleteAssignment ===');
    console.log('isLogged:', this.isLogged());
    console.log('isAdmin:', this.isAdmin());
    console.log('assignmentTransmis:', this.assignmentTransmis);
    
    
   if(!this.assignmentTransmis) {
      console.log('Pas d\'assignment transmis');
      return;
    }

    console.log("Suppression de l'assignment " + this.assignmentTransmis.nom);
    this.assignmentsService.deleteAssignment(this.assignmentTransmis)
    .subscribe(message => {
      console.log(message);

      this.router.navigate(['/home']);

    });
  }

  
  onClickEdit() {
    if(!this.assignmentTransmis) return;
    this.router.navigate([`/assignment`, this.assignmentTransmis._id,`edit`],
    { queryParams: { nom: this.assignmentTransmis.nom }, fragment: 'edition'}
    );
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  retournerAccueil() {
    this.router.navigate(['/']);
  }


  // Méthode estEnRetard
  estEnRetard(): boolean {
    if (!this.assignmentTransmis) return false;
    const today = new Date();
    const dateRendu = new Date(this.assignmentTransmis.dateDeRendu);
    today.setHours(0, 0, 0, 0);
    dateRendu.setHours(0, 0, 0, 0);
    return !this.assignmentTransmis.rendu && dateRendu < today;
  }

}
