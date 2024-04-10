import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { ApprenantCour } from '../models/ApprenantCour';
import type { Observable } from 'rxjs';
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


    getCoursByApprenantId(apprenantId: number): Observable<Cour[]> {
    const url = `${this.baseUrl}/cours/${apprenantId}`;
    return this.http.get<Cour[]>(url);
  }
  getCoursApprenantByApprenantId(apprenantId: number): Observable<ApprenantCour[]> {
    return this.http.get<ApprenantCour[]>(`${this.baseUrl}/coursApprenant/${apprenantId}`);
  }

  getApprenantsByCourId(courId: number): Observable<Apprenant[]> {
    return this.http.get<Apprenant[]>(`${this.baseUrl}/apprenants/${courId}`);
  }

}
