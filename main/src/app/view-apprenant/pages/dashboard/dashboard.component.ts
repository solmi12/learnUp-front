import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, Observable, of, forkJoin, map } from 'rxjs';
import { Apprenant } from 'src/app/models/Apprenant';
import { Payment } from 'src/app/models/Payment';
import { Category, Cour } from 'src/app/models/cour.model';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CourService } from 'src/app/services/cour.service';
import { PaymentService } from 'src/app/services/payment.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard-apprenant',
  styleUrls: ['./dashbord-apprenant.component.scss'],
  templateUrl: './dashboard-apprenant.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppDashboardApprenantComponent {

  apprenant: Apprenant | undefined;
  cour: Cour[] = [];
  categories: Category[] = [];
  searchCourName: string = '';
  courIdToCheck: number = 1;
  apprenantId: number = 0;
  payments$: Observable<Payment[]> | undefined;

  constructor(
    @Inject(CourService) private courService: CourService,
    @Inject(AuthServiceService) private authService: AuthServiceService,
    @Inject(Router) private router: Router,
    @Inject(UserService) private userService: UserService,
    @Inject(PaymentService) private paymentService: PaymentService
  ) {}

  ngOnInit(): void {
    this.getCategories(); // Fetch categories first if needed
    this.getUserDetails();
  }

  viewCourDetails(courId: number): void {
    this.router.navigate(['/ui-components/cour', courId]);
  }

  searchCoursByCourName(searchValue: string): void {
    this.searchCourName = searchValue;
    this.courService.getToolsByCourName(this.searchCourName).subscribe(
      (cour) => {
        this.cour = cour;
        console.log(`Cours filtered by cour name '${this.searchCourName}':`, this.cour);
      },
      (error) => {
        console.error(`Error fetching cours for cour name '${this.searchCourName}':`, error);
      }
    );
  }

  getCategories(): void {
    this.courService.getAllCours().subscribe(
      (cour) => {
        this.categories = Array.from(new Set(cour.map(cour => cour.category?.categoryName)))
          .map(categoryName => ({ categoryId: 0, categoryName, cour: [] }));

        console.log('All categories:', this.categories);
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  filterCoursByCategory(categoryName: string): void {
    this.courService.getCoursByCategory(categoryName).subscribe(
      (cour) => {
        this.cour = cour;
        console.log(`Tools filtered by category '${categoryName}':`, this.cour);
      },
      (error) => {
        console.error(`Error fetching tools for category '${categoryName}':`, error);
      }
    );
  }

  getUserDetails(): void {
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10);
    if (!isNaN(userId)) {
      this.userService.getUserById(userId).pipe(
        switchMap((data: any) => {
          console.log('Response Object:', data);
  
          this.apprenantId = data.apprenantId;
          console.log('Apprenant ID:', this.apprenantId);
  
          return this.paymentService.getPaymentsWithCourByApprenantId(this.apprenantId).pipe(
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
        }),
        catchError(error => {
          console.error('Error fetching apprenant payments:', error);
          return throwError('Error fetching apprenant payments');
        })
      ).subscribe(
        (paymentsWithCour: Payment[]) => {
          this.payments$ = of(paymentsWithCour);
          console.log('Payments with cour details:', this.payments$);
        }
      );
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }
  
}
