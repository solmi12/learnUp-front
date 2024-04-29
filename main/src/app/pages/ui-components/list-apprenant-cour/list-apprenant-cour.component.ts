import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Payment } from 'src/app/models/Payment';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-list-apprenant-cour',
  templateUrl: './list-apprenant-cour.component.html',
  styleUrls: ['./list-apprenant-cour.component.scss']
})
export class ListApprenantCourComponent implements OnInit {
  paymentsByCourNameMap: Map<string, Payment[]> = new Map();
  payments: Payment[] = []; // Define payments as an array

  constructor(private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.getAllPayments();
  }

  getAllPayments(): void {
    this.paymentService.getAllPayments().subscribe(
      (payments: Payment[]) => {
        this.payments = payments; // Assign the fetched payments to the component property
        this.groupPaymentsByCourName(payments);
      },
      (error) => {
        console.error('Error fetching all payments:', error);
      }
    );
  }

  groupPaymentsByCourName(payments: Payment[]): void {
    for (const payment of payments) {
      if (!this.paymentsByCourNameMap.has(payment.courName)) {
        this.paymentsByCourNameMap.set(payment.courName, []);
      }
      this.paymentsByCourNameMap.get(payment.courName)?.push(payment);
    }
  }
}
