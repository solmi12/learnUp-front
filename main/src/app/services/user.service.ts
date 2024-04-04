import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { userDTO } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private apiUrl = 'http://localhost:8080/user';

  constructor(@Inject(HttpClient) private http: HttpClient) {}
  getUserById(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const options = {
      headers: headers,
      responseType: 'json' as const 
    };
    const url = `${this.apiUrl}/${userId}`;
    return this.http.get(url, options);
  }
  
}
