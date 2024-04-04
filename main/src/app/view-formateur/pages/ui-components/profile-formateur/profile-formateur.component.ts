import { Component, Inject, type OnInit } from '@angular/core';
import type { Form } from '@angular/forms';
import { catchError, switchMap, throwError } from 'rxjs';
import type { Formateur } from 'src/app/models/formateur';
import type { userDTO } from 'src/app/models/user';
import { FormateurService } from 'src/app/services/formateur.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile-formateur',
  templateUrl: './profile-formateur.component.html',
  styleUrls: ['./profile-formateur.component.scss']
})
export class ProfileFormateurComponent implements OnInit{

  formateur: Formateur | null = null;
  formateurtId: number = 0;
  showEditForm: boolean = false; 
  loading: boolean = true
  user: userDTO | null = null;
  constructor (@Inject(FormateurService) private formateurService : FormateurService,@Inject(UserService) private userService: UserService) {}


  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const id = parseInt(storedId || '', 10); 
    if (!isNaN(id)) {
      this.getUserDetails(id);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }

  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        console.log('Response Object:', data);

        this.formateurtId = data.formateurId; 
        console.log('Formateur ID:', this.formateurtId); 

        this.loading = false; 
        return this.formateurService.getFormateurById(this.formateurtId);
      }),
      catchError(error => {
        console.error('Error fetching admin:', error);
        this.loading = false; 
        return throwError('Error fetching admin');
      })
    ).subscribe(
      (formateurData: Formateur) => {
        this.formateur = formateurData;
        console.log(this.formateur); 
      }
    );
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
  }

  
  updateApprenantDetails(): void {
    if (this.formateur) {
      
      this.formateurService.updateFormateur(this.formateur.formateurId, this.formateur).subscribe(
        (updatedFormateur: Formateur) => {
          console.log('formateur updated successfully:', updatedFormateur);
          this.formateur = updatedFormateur;
        
        },
        
        (error) => {
          console.error('Error updating admin:', error);
          
      
        }
      );
    } else {
      console.error('formateur data is not available.');
    }
  }
}
