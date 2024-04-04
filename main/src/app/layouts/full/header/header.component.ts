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
import type { AdminDTO } from 'src/app/models/admin';
import type { Cour } from 'src/app/models/cour.model';
import type { userDTO } from 'src/app/models/user';
import { AdminService } from 'src/app/services/admin.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CourService } from 'src/app/services/cour.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent implements OnInit{
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  @Output() navigateToProfile = new EventEmitter<void>();

  admin: AdminDTO | undefined;
  user: userDTO | null = null;
  showFiller = false;
  notifications: Cour[] = [];

  adminId: number = 0;
  constructor(public dialog: MatDialog,@Inject(AuthServiceService)private authService: AuthServiceService, @Inject(Router) private router: Router,
  @Inject(AdminService)private adminService: AdminService,@Inject(UserService) private userService: UserService,
  @Inject(CourService) private courService:CourService) {}
  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10); // Parse to integer with base 10
    if (!isNaN(userId)) {
      this.getUserDetails(userId);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
   
    this.fetchNotifications();
  }

  fetchNotifications(): void {
    this.courService.getAdminNotifications()
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
        // Log the entire response object to the console for debugging
        console.log('Response Object:', data);

        // Extract the Admin ID from the response directly
        this.adminId = data.adminId; // Assign adminId from response
        console.log('Admin ID:', this.adminId); // Log adminId

        return this.adminService.getAdminById(this.adminId); // Return the observable
      }),
      catchError(error => {
        console.error('Error fetching admin:', error);
   
        return throwError('Error fetching admin');
      })
    ).subscribe(
      (adminData: AdminDTO) => {
        this.admin = adminData;
        console.log(this.admin); // Handle admin data as needed
      }
    );
  }

  logout(): void {
    this.authService.logout(); // Call the logout method from AuthServiceService
    this.router.navigateByUrl('/authentication/login'); // Navigate to the signin path after logout
  }
  onProfileButtonClick(): void {
    this.router.navigateByUrl('/profile');
  }
}
