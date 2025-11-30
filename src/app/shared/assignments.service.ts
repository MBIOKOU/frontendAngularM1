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
  
  /*
  assignments : Assignment []= [
    {
        id : 1,
        nom : 'Angular Project',
        dateDeRendu : new Date('2025-09-30'),
        rendu : false

      },
      {
        id: 2,
        nom : 'TypeScript Basics',
        dateDeRendu : new Date('2025-10-15'),
        rendu : true
  }];
  
  */
  
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

  getAssignment(id: number) : Observable<any> {
    return this.http.get<any>(this.backendUrl+ '/' + id)
      .pipe(
        map(a=> {
        a.nom += "transformé avec pipe....";
        return a;
        }),

        tap (_ => {
          console.log("tap : assignmet avec id=" + id + "requête Get envoyée sur MongoDB cloud"); 
        }),

        catchError(this.handleError<any>('getAssignment id=${id}'))
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


}


