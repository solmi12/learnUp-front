import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { Cour } from '../models/cour.model';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourService {

  

  private baseUrl = 'http://localhost:8080/cour';
  constructor(@Inject(HttpClient)private httpClient: HttpClient) { }

  getAdminNotifications(): Observable<Cour[]> {
    return this.httpClient.get<Cour[]>(`${this.baseUrl}/admin/notifications`);
  }
  
  
  getFormateurNotifications(): Observable<Cour[]> {
    return this.httpClient.get<Cour[]>(`${this.baseUrl}/formateur/notifications`);
  }
  
  
  addCour(cour: Cour): Observable<Cour> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = {
      headers: headers,
      responseType: 'text' as 'json' // Set responseType to 'text' for plain text response
    };
    return this.httpClient.post<Cour>(`${this.baseUrl}/add`, cour,options);
  }

  getCoursByFormateurId(formateurId: number): Observable<Cour[]> {
    
    const url = `${this.baseUrl}/formateur/${formateurId}`; 
    return this.httpClient.get<Cour[]>(url);
  }
   
  deleteCour(courId: number): Observable<void> {
    const url = `${this.baseUrl}/${courId}`;
    return this.httpClient.delete<void>(url);
  }

  getAllCours(): Observable<Cour[]> {
    return this.httpClient.get<Cour[]>(`${this.baseUrl}`);
  }

  getToolsByCourName(courName: string): Observable<Cour[]> {
    const url = `${this.baseUrl}/search?courName=${courName}`;
    return this.httpClient.get<Cour[]>(url);
  }
  
  getCoursByCategory(categoryName: string): Observable<Cour[]> {
    return this.httpClient.get<Cour[]>(`${this.baseUrl}/byCategory?categoryName=${categoryName}`);
  }
  getPendingCourses(): Observable<Cour[]> {
    return this.httpClient.get<Cour[]>(`${this.baseUrl}/pending-courses`);
  }
  

  getAcceptedCourses(): Observable<Cour[]> {
    return this.httpClient.get<Cour[]>(`${this.baseUrl}/accepted-courses`);
  }
  
  refuseCour(courId: number): Observable<Cour> {
    const url = `${this.baseUrl}/refuse-cour/${courId}`;
    return this.httpClient.put<Cour>(url, {});
  }
  acceptCour(courId: number): Observable<Cour> {
    const url = `${this.baseUrl}/accept-cour/${courId}`;
    return this.httpClient.put<Cour>(url, {});
  }

  getByCourId(courId: number): Observable<Cour> {
    const url = `${this.baseUrl}/${courId}`;
    return this.httpClient.get<Cour>(url);
  }
}
