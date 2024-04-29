import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import type { Payment } from '../models/Payment';
import { CourService } from './cour.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/payments';

  private courServiceUrl = 'http://localhost:8080/cour';
  constructor(private http: HttpClient,
    @Inject(CourService)private courService:CourService) { }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/all`);
  }

  getPaymentsByApprenantId(apprenantId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/byApprenant/${apprenantId}`);
  }

  getPaymentsByCourId(courId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/byCour/${courId}`);
  }

  getPaymentsByCourName(courName: string): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.apiUrl}/byCourName/${courName}`);
  }

  getPaymentsWithCourByApprenantId(apprenantId: number): Observable<Payment[]> {
    return this.getPaymentsByApprenantId(apprenantId).pipe(
      switchMap((payments: Payment[]) => {
        const getCourRequests = payments.map(payment => this.courService.getByCourId(payment.courId));

        return forkJoin(getCourRequests).pipe(
          map(cours => {
            // Assign the fetched cour to their respective payment
            payments.forEach((payment, index) => {
              payment.cour = cours[index];
            });
            return payments;
          })
        );
      })
    );
  }
  

  savePayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/save`, payment);
  }
}
