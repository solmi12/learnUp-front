import { Component, Inject, OnInit } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import type { Apprenant } from 'src/app/models/Apprenant';
import type { userDTO } from 'src/app/models/user';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  styleUrls: ['./badge.component.scss']
})
export class AppBadgeComponent implements OnInit {
  apprenant: Apprenant | null = null;
  user: userDTO | null = null;
  showEditForm: boolean = false; 
  apprenantId: number = 0;
  loading: boolean = true
  constructor(@Inject(UserService) private userService: UserService,
  @Inject(StudentService)private apprenantService:StudentService) { }

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10);     if (!isNaN(userId)) {
      this.getUserDetails(userId);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }

  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        console.log('Response Object:', data);

        this.apprenantId = data.apprenantId; 
        console.log('Admin ID:', this.apprenantId); 

        this.loading = false; 
        return this.apprenantService.getStudentById(this.apprenantId);
      }),
      catchError(error => {
        console.error('Error fetching admin:', error);
        this.loading = false; 
        return throwError('Error fetching admin');
      })
    ).subscribe(
      (appraenantData: Apprenant) => {
        this.apprenant = appraenantData;
        console.log(this.apprenant); 
      }
    );
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }

  
  updateApprenantDetails(): void {
    if (this.apprenant) {
      
      this.apprenantService.updateStudent(this.apprenant.apprenantId, this.apprenant).subscribe(
        (updatedApprenant: Apprenant) => {
          console.log('Admin updated successfully:', updatedApprenant);
          this.apprenant = updatedApprenant;
        
        },
        
        (error) => {
          console.error('Error updating admin:', error);
          
      
        }
      );
    } else {
      console.error('Admin data is not available.');
    }
  }
}
