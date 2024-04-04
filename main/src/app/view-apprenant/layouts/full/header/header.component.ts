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
    this.getAllCours();
    this.getCategories();
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10); // Parse to integer with base 10
    if (!isNaN(userId)) {
      this.getUserDetails(userId).subscribe(() => {
        this.fetchMessageNotifications(); // Call fetchMessageNotifications after getting user details
      });
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
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
  
  

  getUserDetails(userId: number): Observable<number> {
    return this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        // Log the entire response object to the console for debugging
        console.log('Response Object:', data);
  
        // Extract the Apprenant ID from the response directly
        const apprenantId = data.apprenantId; // Extract apprenantId from response
        console.log('Apprenant ID:', apprenantId); // Log apprenantId
  
        // Assign the extracted apprenantId to this.apprenantId
        this.apprenantId = apprenantId;
  
        // Return the apprenantId as an observable
        return of(apprenantId);
      }),
      catchError(error => {
        console.error('Error fetching apprenant:', error);
        return throwError('Error fetching apprenant');
      })
    );
  }
  
  getAllCours(): void {
    // Use the toolService to get all tools
    this.courService.getAllCours().subscribe(
      (cour) => {
        // Set the received tools to the component property
        this.cour = cour;
        console.log('All tools:', this.cour);  // Log the assigned tools
      },
      (error) => {
        // Handle errors, such as displaying an error message
        console.error('Error fetching tools:', error);
      }
    );
  }


  searchCoursByCourName(searchValue: string): void {
    this.searchCourName = searchValue; // Assign the input value to the component property
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

  
// tool.component.ts
getCategories(): void {
  this.courService.getAllCours().subscribe(
    (cour) => {
      this.categories = Array.from(new Set(cour.map(cour =>cour.category?.categoryName)))
        .map(categoryName => ({ categoryId: 0, categoryName, cour: [] }));
    
      console.log('All categories:', this.categories);
    },
    (error) => {
      console.error('Error fetching categories:', error);
    }
  );
}

// tool.component.ts
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

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthServiceService
    this.router.navigateByUrl('/authentication/login'); // Navigate to the signin path after logout
  }
}
