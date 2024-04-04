import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { AdminDTO } from 'src/app/models/admin';
import { UserService } from 'src/app/services/user.service';
import { userDTO } from 'src/app/models/user';
import { catchError, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-profil-admin',
  templateUrl: './profil-admin.component.html',
  styleUrls: ['./profil-admin.component.scss']
})
export class ProfilAdminComponent implements OnInit {
  admin: AdminDTO | null = null;
  user: userDTO | null = null;
  showEditForm: boolean = false; 
  adminId: number = 0;
  loading: boolean = true;
  constructor(private adminService: AdminService, private userService: UserService) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10); 
    if (!isNaN(userId)) {
      this.getUserDetails(userId);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }

  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        console.log('Response Object:', data);
        this.adminId = data.adminId;
        console.log('Admin ID:', this.adminId); 

        this.loading = false; 
        return this.adminService.getAdminById(this.adminId); 
      }),
      catchError(error => {
        console.error('Error fetching admin:', error);
        this.loading = false; 
        return throwError('Error fetching admin');
      })
    ).subscribe(
      (adminData: AdminDTO) => {
        this.admin = adminData;
        console.log(this.admin); 
      }
    );
  }

  toggleEditForm(): void { 
    this.showEditForm = !this.showEditForm;
  }

  updateAdminDetails(): void {
    if (this.admin) {
      this.adminService.updateAdmin(this.admin.adminId, this.admin).subscribe(
        (updatedAdmin: AdminDTO) => {
          console.log('Admin updated successfully:', updatedAdmin);
          this.admin = updatedAdmin;
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
