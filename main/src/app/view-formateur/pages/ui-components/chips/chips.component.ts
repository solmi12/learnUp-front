import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { CourService } from 'src/app/services/cour.service';
import type { userDTO } from 'src/app/models/user';

@Component({
  selector: 'app-chips-formateur',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class AppChipsFormateurComponent implements OnInit {
  
  user: userDTO | null = null;
  formateurId: number = 0; 
cour = {
  courId: null,
  courName: '',
  description:'',
  price:0,
  category: {
    categoryName: ''
  },
  imageData: '', 
  formateurId:0,
  needsReview:true,
  status:''
}
  constructor(
    @Inject(CourService) private courService: CourService,
    @Inject(ToastrService) private toastr: ToastrService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
    @Inject(UserService) private userService: UserService
  ) {
  
  }

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

        this.formateurId = data.formateurId;
        console.log('Formateur ID:', this.formateurId); 
        return of(data); 
      })
    ).subscribe();
  }

  onSubmit(): void {
    console.log('Form Value:', this.cour);
  
    const formData = this.cour;
  
    if (formData.imageData) {
      formData.imageData = formData.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    }
    formData.formateurId = this.formateurId;
  
    this.courService.addCour(formData).subscribe(
      (addedCour) => {
        console.log('Cour added successfully:', addedCour);
        this.toastr.success('Cour added successfully!', 'Success', {
          timeOut: 10000,
          progressBar: true,
          positionClass: 'toast-top-center',
          closeButton: true,
          tapToDismiss: false,
          extendedTimeOut: 1000,
          enableHtml: true,
          toastClass: 'ngx-toastr custom-toast-success',
        });
        this.clearForm();
      },
      (error) => {
        console.error('Error adding tool:', error);
        this.toastr.error('Error adding tool. Please try again.', 'Error');
      }
    );
  }
  
  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Set the imageData with the base64 encoded image data
        this.cour.imageData = reader.result as string;
      };
    }
  }

  clearForm(): void {
    this.cour.category.categoryName = '',
    this.cour.description = '',
    this.cour.imageData = '',
    this.cour.price =0,
    this.cour.courName= '',
    this.cour.formateurId=0
  }
}
