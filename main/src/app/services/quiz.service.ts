import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import type { Observable } from 'rxjs';
import type { QuizDto } from '../models/Quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private baseUrl = 'http://localhost:8080/quiz';

  constructor(@Inject(HttpClient) private http: HttpClient) { }

  getAllQuizzes(): Observable<QuizDto[]> {
    return this.http.get<QuizDto[]>(`${this.baseUrl}/quiz/all`);
  }

  getQuizByCourId(courId: number): Observable<QuizDto> {
    return this.http.get<QuizDto>(`${this.baseUrl}/byCourId/${courId}`);
  }

  saveQuiz(quizDto: QuizDto): Observable<QuizDto> {
    return this.http.post<QuizDto>(`${this.baseUrl}/save`, quizDto);
  }

  deleteQuiz(quizId: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.baseUrl}/quiz/delete/${quizId}`);
  }

  checkUserResponse(quizResponse: QuizDto): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/quiz/check-response`, quizResponse);
  }
}
