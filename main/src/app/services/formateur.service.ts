// formateur.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import type { Formateur } from '../models/formateur';
import type { FormateurAndUserDTO } from '../models/FormateurAndUser';

@Injectable({
  providedIn: 'root'
})
export class FormateurService {
  private apiUrl = 'http://localhost:8080/formateur'; 

  constructor(private http: HttpClient) { }

  addFormateur(formateurAndUser: FormateurAndUserDTO): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add`,formateurAndUser);
  }
  updateFormateur(formateurId: number, formateurDto: Formateur): Observable<Formateur> {
    return this.http.put<Formateur>(`${this.apiUrl}/${formateurId}`, formateurDto);
  }


 

  getFormateurById(formateurId: number): Observable<Formateur> {
    return this.http.get<Formateur>(`${this.apiUrl}/${formateurId}`);
  }
  getAllFormateurs(): Observable<Formateur[]> {
    return this.http.get<Formateur[]>(`${this.apiUrl}/all`);
  }

  deleteFormateur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
