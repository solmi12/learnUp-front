import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { SouhaitsDto } from '../models/SouhaitsDto';
import { catchError, throwError, type Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SouhaitsService {
  private baseUrl = 'http://localhost:8080/souhaits'; // Adjust the base URL according to your backend API

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  addSouhait(souhait: SouhaitsDto): Observable<SouhaitsDto> {
    return this.http.post<SouhaitsDto>(`${this.baseUrl}/add`, souhait);
  }

  getCoursByApprenantId(apprenantId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/cours/${apprenantId}`);
  }

  getSouhaitsByApprenantId(apprenantId: number): Observable<any> {
    const url = `${this.baseUrl}/souhaits/${apprenantId}`;
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
  deleteSouhait(souhaitId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${souhaitId}`);
  }


}
