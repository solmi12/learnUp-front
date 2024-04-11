import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { ApprenantCour } from '../models/ApprenantCour';
import { catchError, throwError, type Observable } from 'rxjs';
import type { Cour } from '../models/cour.model';
import type { Apprenant } from '../models/Apprenant';

@Injectable({
  providedIn: 'root'
})
export class ApprenantCourService { 

  private baseUrl = 'http://localhost:8080/apprenantCour';
  constructor(@Inject(HttpClient) private http: HttpClient) {}

  addApprenantCour(dto: ApprenantCour): Observable<ApprenantCour> {
    return this.http.post<ApprenantCour>(`${this.baseUrl}/add`, dto);
  }

  deleteApprenantCour(apprenantCourid: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${apprenantCourid}`);
  }


  getCoursByApprenantId(apprenantId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cours/${apprenantId}`);
  }

  getCoursApprenantByApprenantId(apprenantId: number): Observable<any> {
    const url = `${this.baseUrl}/coursApprenant/${apprenantId}`;
    return this.http.get<any>(url).pipe(
      catchError(error => {
        let errorMessage = 'Error fetching souhaits.';
        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
      })
    );
  }
  getApprenantsByCourId(courId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/apprenants/${courId}`);
  }

}
