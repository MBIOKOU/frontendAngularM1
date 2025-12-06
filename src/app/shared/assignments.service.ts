import { Injectable } from '@angular/core';
import { Assignment } from '../assignments/assignment.model';
import { Observable, of} from 'rxjs';  
import { LoggingService } from './logging.service';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { map, tap, catchError} from 'rxjs/operators';
import { bdInitialAssignments } from './data';
import { forkJoin } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  backendUrl = 'https://apiprojetangularm1.onrender.com/api/assignments';
    
  constructor  (private loggingService :LoggingService, private http: HttpClient){ };
  
  
  private handleError<T>(operation:string, result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} a échoué: ${error.message}`);
      return of(result as T); 
    }
  }

  private HttpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'})
  };

  getAssignmentsPagine(page:number, limit:number) : Observable<any> {
    return this.http.get<any>(this.backendUrl + "?page=" + page + "&limit=" + limit);
  }


  getAssignments() : Observable<Assignment[]> {
    return this.http.get<Assignment[]>(this.backendUrl);
  }

  getAssignment(_id: number) : Observable<any> {
    return this.http.get<any>(this.backendUrl+ '/' + _id)
      .pipe(
        tap (_ => {
          console.log("tap : assignmet avec id=" + _id + "requête Get envoyée sur MongoDB cloud"); 
        }),

        catchError(this.handleError<any>('getAssignment _id=${_id}'))
      );
  
  }

  addAssignment(assignment: Assignment) : Observable<any> {    
    return this.http.post<any>(this.backendUrl, assignment, this.HttpOptions);
  }

  updateAssignment(assignment: Assignment) : Observable<any> {
    return this.http.put<any>(this.backendUrl, assignment);
  }

 deleteAssignment(assignment: Assignment): Observable<any> {
    return this.http.delete<any>(this.backendUrl + '/' + assignment._id);
  }

  // Méthode pour peupler la base de données avec les données initiales
  peuplerBDavecForkJoin():Observable<any> {
   let appelsVersAddAssignment:Observable<any>[] = [];

   bdInitialAssignments.forEach(a => {
     const nouvelAssignment = new Assignment();
     nouvelAssignment.nom = a.nom;
     nouvelAssignment.dateDeRendu = new Date(a.dateDeRendu);
     nouvelAssignment.rendu = a.rendu;

     appelsVersAddAssignment.push(this.addAssignment(nouvelAssignment))
   });

   return forkJoin(appelsVersAddAssignment);
 }


 // méthode pour récupérer les assignments filtrés
 getAssignmentsPagineFiltre(page:number, limit:number, rendu?: boolean, enRetard?: boolean) : Observable<any> {
    let url = this.backendUrl + "?page=" + page + "&limit=" + limit;
    if (rendu !== undefined) {
        url += "&rendu=" + rendu;
    }
    if (enRetard) {
        url += "&enRetard=true";
    }
    return this.http.get<any>(url);
  }

}

