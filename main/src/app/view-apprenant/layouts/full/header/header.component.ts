import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  Inject,
  type OnInit,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, type Observable, of } from 'rxjs';
import type { Apprenant } from 'src/app/models/Apprenant';
import type { QuestionReponse } from 'src/app/models/QuestionReponse';
import type { Category, Cour } from 'src/app/models/cour.model';
import type { userDTO } from 'src/app/models/user';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CourService } from 'src/app/services/cour.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-header-apprenant',
  templateUrl: './header-apprenant.component.html',
  styleUrls: ['./header-apprenant.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderApprenantComponent implements OnInit {
  

  cour: Cour[] = [];
  apprenant: Apprenant | undefined;
  user: userDTO | null = null;
  categories: Category[] = [];
  apprenantId: number = 0;
  searchCourName: string = '';  
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  notificationsMessage:QuestionReponse[] = [];

  showFiller = false;

  constructor(@Inject(CourService) private courService:CourService,public dialog: MatDialog
  ,@Inject(AuthServiceService)private authService: AuthServiceService
  , @Inject(Router) private router: Router,
  @Inject(UserService) private userService: UserService,
  @Inject (StudentService) private apprenantService:StudentService,
  @Inject(QuestionResponseService) private questionReponseService:QuestionResponseService) {}
 
  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10); 
    if (!isNaN(userId)) {
      this.getUserDetails(userId);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
   
    this.fetchMessageNotifications();
  }

  getInitials(fullName: string | undefined): string {
    if (!fullName) {
      return ''; 
    }
    const initials = fullName.trim().split(' ')
      .map(word => word.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
    return initials;
  }

  fetchMessageNotifications(): void {
    if (this.apprenantId !== 0) {
      this.questionReponseService.getApprenantNotifications(this.apprenantId)
        .subscribe(
          (data: QuestionReponse[]) => {
            this.notificationsMessage = data;
            console.log('Notifications Message:', this.notificationsMessage);
          },
          (error) => {
            console.error('Error fetching notifications:', error);
          }
        );
    } else {
      console.error('Invalid apprenant ID');
    }
  }
  
  
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        console.log('Response Object:', data);

        this.apprenantId = data.apprenantId; 
        console.log('ApprenantId:', this.apprenantId); 

        return this.apprenantService.getStudentById(this.apprenantId); 
      }),
      catchError(error => {
        console.error('Error fetching apprenant:', error);
   
        return throwError('Error fetching apprenant');
      })
    ).subscribe(
      (apprenantData: Apprenant) => {
        this.apprenant = apprenantData;
        console.log(this.apprenant);
      }
    );
  }
 
  

  





  logout(): void {
    this.authService.logout(); 
    this.router.navigateByUrl('/authentication/login'); 
  }
}
