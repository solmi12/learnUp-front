import type { StudentAndUserDTO } from '../models/ApprenatAndUser';
import type { Apprenant } from '../models/Apprenant';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/students';

  constructor(@Inject(HttpClient)private http: HttpClient) { }

  addStudent(studentAndUser: StudentAndUserDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/add`, studentAndUser);
  }
  getAllStudents(): Observable<Apprenant[]> {
    return this.http.get<Apprenant[]>(`${this.baseUrl}/all`);
  }

  getStudentById(apprenantId: number): Observable<Apprenant> {
    return this.http.get<Apprenant>(`${this.baseUrl}/${apprenantId}`);
  }
  getApprenantsByClasse(classe: string): Observable<Apprenant[]> {
    const url = `${this.baseUrl}/byClasse/${classe}`;
    return this.http.get<Apprenant[]>(url);
  }

  updateStudent(apprenantId: number, apprenantDTO: Apprenant): Observable<Apprenant> {
    return this.http.put<Apprenant>(`${this.baseUrl}/${apprenantId}`, apprenantDTO);
  }

  deleteStudentById(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
