import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Apprenant } from 'src/app/models/Apprenant'; // Assuming this import is correct
import type { Payment } from 'src/app/models/Payment';
import { Cour } from 'src/app/models/cour.model';
import { CourService } from 'src/app/services/cour.service';
import { PaymentService } from 'src/app/services/payment.service';
import { StudentService } from 'src/app/services/student.service';

@Component({
  selector: 'app-payment-admin',
  templateUrl: './payment-admin.component.html',
  styleUrls: ['./payment-admin.component.scss']
})
export class PaymentAdminComponent implements OnInit {
  apprenantId: number;
  apprenant: Apprenant | undefined;
  selectedCourseId: number | undefined;
  selectedCourse: Cour | undefined;
  cour: Cour[] = []; 
  paymentAmount: number = 0; 
  constructor(
    private route: ActivatedRoute,
    private studentService: StudentService,
    private courService: CourService,
    @Inject(PaymentService) private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.apprenantId = +params['apprenantId']; 
      this.getStudentById(this.apprenantId);
    });
    
    this.getAcceptedCourses();
  }

  getAcceptedCourses(): void {
    this.courService.getAcceptedCourses().subscribe(
      (courses: Cour[]) => {
        this.cour = courses;
        console.log('Accepted courses:', this.cour); 
      },
      (error) => {
        console.error('Error fetching accepted courses:', error);
      }
    );
  }
  
  getStudentById(apprenantId: number): void {
    this.studentService.getStudentById(apprenantId).subscribe(
      (data: Apprenant) => {
        this.apprenant = data;
        console.log('Apprenant:', this.apprenant);
      },
      (error) => {
        console.error('Error fetching apprenant:', error);
      }
    );
  }

  savePayment(): void {
    if (this.apprenantId && this.selectedCourseId && this.selectedCourse) {
      const selectedCoursePrice = parseFloat(
        document.querySelector('.selected-course-price')?.textContent || '0'
      );
  
      const payment: Payment = {
        apprenantId: this.apprenantId,
        courId: this.selectedCourseId,
        paymentDate: new Date(),
        paymentPrice: this.paymentAmount,
        courName: this.selectedCourse?.courName || '',
        fullName: this.apprenant?.fullName,
        totalPrice: this.selectedCourse?.price,
      };
  
      this.paymentService.savePayment(payment).subscribe(
        (savedPayment: Payment) => {
          console.log('Payment saved successfully:', savedPayment);
        },
        (error) => {
          console.error('Error saving payment:', error);
        }
      );
    } else {
      console.error('Apprenant ID, Selected Course ID, or Selected Course data is undefined.');
    }
  }
  
  getSelectedCourseDetails(): void {
    if (this.selectedCourseId) {
      this.courService.getByCourId(this.selectedCourseId).subscribe(
        (course: Cour) => {
          this.selectedCourse = course;
          console.log('Selected course:', this.selectedCourse);
        },
        (error) => {
          console.error('Error fetching selected course details:', error);
        }
      );
    } else {
      console.error('Selected course ID is undefined.');
    }
  }
}
