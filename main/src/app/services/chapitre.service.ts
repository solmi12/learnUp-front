
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { Chapitre } from '../models/Chapitre';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChapitreService {

  private baseUrl = 'http://localhost:8080/chapitres';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  addChapitre(chapitreDto: Chapitre): Observable<Chapitre> {
    return this.http.post<Chapitre>(`${this.baseUrl}/add`, chapitreDto);
  }

  getChapitresByCourId(courId: number): Observable<Chapitre[]> {
    return this.http.get<Chapitre[]>(`${this.baseUrl}/byCourId/${courId}`);
  }
}
