import { Component, EventEmitter, Output } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatListModule} from '@angular/material/list';
import {Router} from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

import { Assignment } from '../assignment.model';
import { AssignmentsService } from '../../shared/assignments.service';


@Component({
  selector: 'app-add-assignment',
  standalone: true,
  imports: [MatDividerModule, MatInputModule,
    MatFormFieldModule, MatButtonModule,
    MatDatepickerModule, 
    FormsModule, MatListModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './add-assignment.html',
  styleUrl: './add-assignment.css'
})
export class AddAssignment {
 // Pour le formulaire, une variable par champ 
  nomAssignment = "";
  dateDeRendu !: Date;

  // Injecter le service dans le constructeur
  constructor(private assignmentsService: AssignmentsService,
              private router: Router) { }


  onAjouterAssignment(event:any) {
      console.log("Ajout NOM = " + this.nomAssignment + " date = " + this.dateDeRendu);
      
      // On crée un nouvel assignment
      const nouvelAssignment: Assignment = new Assignment();
      //nouvelAssignment.id = Math.floor(Math.random() * 1000000); 
      nouvelAssignment.nom = this.nomAssignment;
      nouvelAssignment.dateDeRendu = this.dateDeRendu;
      nouvelAssignment.rendu = false; 
      console.log(nouvelAssignment);

      // On l'ajoute à la liste 
      this.assignmentsService.addAssignment(nouvelAssignment)
        .subscribe(message => {
        console.log("Assignment ajouté avec succès");
        // Redirection vers la page d'accueil
        this.router.navigate(['/home']);
        });
  }
  onAddAssignment() {  
        console.log('Ajout d’un assignment');
  }

  onCancel() {
     this.router.navigate(['/']);
   }

}
