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
import { catchError, switchMap, throwError } from 'rxjs';
import type { QuestionReponse } from 'src/app/models/QuestionReponse';
import type { Cour } from 'src/app/models/cour.model';
import type { Formateur } from 'src/app/models/formateur';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CourService } from 'src/app/services/cour.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-header-formateur',
  templateUrl: './header-formateur.component.html',
  
  styleUrls: ['./header-formateur.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderFormateurComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  formateur:Formateur | undefined;
  notifications: Cour[] = [];
  notificationsMessage:QuestionReponse[] = [];
  showFiller = false;
formateurId:number = 0
  constructor(public dialog: MatDialog,@Inject(AuthServiceService)private authService: AuthServiceService, @Inject(Router) private router: Router,
  @Inject(CourService) private courService:CourService,@Inject(UserService) private userService: UserService,
  @Inject(FormateurService) private formateurService:FormateurService,
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
   
    this.fetchNotifications();
    this.fetchMessageNotifications();
  }


  fetchMessageNotifications(): void {
    this.questionReponseService.getFormateurNotifications()
      .subscribe(
        (data: QuestionReponse[]) => {
          this.notificationsMessage = data;
          console.log(this.notificationsMessage)
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
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
  

  fetchNotifications(): void {
    this.courService.getFormateurNotifications()
      .subscribe(
        (data: Cour[]) => {
          this.notifications = data;
          console.log(this.notifications)
        },
        (error) => {
          console.error('Error fetching notifications:', error);
        }
      );
  }
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        console.log('Response Object:', data);
        this.formateurId = data.formateurId; 
        console.log('Formateur ID:', this.formateurId); 

        return this.formateurService.getFormateurById(this.formateurId); 
      }),
      catchError(error => {
        console.error('Error fetching formateur:', error);
   
        return throwError('Error fetching formateur');
      })
    ).subscribe(
      (formateurData: Formateur) => {
        this.formateur = formateurData;
        console.log(this.formateur); 
      }
    );
  }
  logout(): void {
    this.authService.logout(); 
    this.router.navigateByUrl('/authentication/login'); 
  }
}
