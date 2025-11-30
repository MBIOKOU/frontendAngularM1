import { Component, Input, Output, EventEmitter,OnInit } from '@angular/core';
import { Assignment } from '../assignment.model';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { AssignmentsService } from '../../shared/assignments.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-assignment-detail',
  imports: [DatePipe,MatCardModule,MatCheckboxModule,
    MatButtonModule, CommonModule],
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
    const id = +this.route.snapshot.params['id'];

    console.log("QUERY PARAMS : ");
    console.log(this.route.snapshot.queryParams);
    console.log("FRAGMENTS : ");
    console.log(this.route.snapshot.fragment);

    this.assignmentsService.getAssignment(id)
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
    this.router.navigate([`/assignment`, this.assignmentTransmis.id,`edit`],
    { queryParams: { nom: this.assignmentTransmis.nom }, fragment: 'edition'}
    );
  }

  isLogged(): boolean {
    return this.authService.isLogged();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

}
