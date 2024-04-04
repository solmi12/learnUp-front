import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { AdminDTO } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:8080/admin';
  constructor(@Inject(HttpClient)private http: HttpClient) { }

  getAdminById(userId: number): Observable<AdminDTO> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get<AdminDTO>(url);
  }
  updateAdmin(adminId: number, updatedAdmin: AdminDTO): Observable<AdminDTO> {
    const url = `${this.apiUrl}/${adminId}`;
    return this.http.put<AdminDTO>(url, updatedAdmin);
  }
}
