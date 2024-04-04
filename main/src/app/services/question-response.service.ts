import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { QuestionReponse } from '../models/QuestionReponse';
import type { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionResponseService {

  
  private baseUrl = 'http://localhost:8080/question';
  constructor(@Inject(HttpClient) private http: HttpClient) { }

  
  addQuestion(dto: QuestionReponse): Observable<QuestionReponse> {
    return this.http.post<QuestionReponse>(`${this.baseUrl}/add`, dto);
  }
  getFormateurNotifications(): Observable<QuestionReponse[]> {
    return this.http.get<QuestionReponse[]>(`${this.baseUrl}/formateur/notifications`);
  }

  updateQuestionReponse(qaId: number, updatedDto: QuestionReponse): Observable<QuestionReponse> {
    const url = `${this.baseUrl}/${qaId}`;
    return this.http.put<QuestionReponse>(url, updatedDto);
  }
  
  getReponseByFormateurId(formateurId: number): Observable<QuestionReponse[]> {
    const params = new HttpParams().set('formateurId', formateurId.toString());
    return this.http.get<QuestionReponse[]>(`${this.baseUrl}/question-reponses`, { params });
  }
  getReponseByApprenantId(apprenantId: number): Observable<QuestionReponse[]> {
    const params = new HttpParams().set('apprenantId', apprenantId.toString());
    return this.http.get<QuestionReponse[]>(`${this.baseUrl}/question`, { params });
  }
  
  getApprenantNotifications(apprenantId: number): Observable<QuestionReponse[]> {
 
    return this.http.get<QuestionReponse[]>(`${this.baseUrl}/apprenant/notifications?apprenantId=${apprenantId}`);
  }
}
