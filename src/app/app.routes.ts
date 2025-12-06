import { Routes } from '@angular/router';
import { Assignments } from './assignments/assignments';
import { AddAssignment } from './assignments/add-assignment/add-assignment';
import { AssignmentDetail } from './assignments/assignment-detail/assignment-detail';
import { EditAssignment} from './assignments/edit-assignment/edit-assignment';
import { authGuard } from './shared/auth-guard';
import { LoginComponent } from './login-page/login-page';


export const routes: Routes = [
      // redirection de la racine vers /home
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    // page home qui sera affichée avec l'url http://localhost:4200/home
    { path: 'home', component: Assignments },
    { path: 'add', component: AddAssignment },
    { path: 'assignment/:_id', component: AssignmentDetail },
    {path: 'login', component: LoginComponent},
    
    { path: 'rendus', component: Assignments },
    { path: 'non-rendus', component: Assignments },
    { path: 'en-retard', component: Assignments },


    { path: 'assignment/:_id/edit', component: EditAssignment, canActivate: [authGuard]},
    // en cas de 404, on redirige vers la home page
    { path: '**', redirectTo: '/home' }
];
