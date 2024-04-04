import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { Cour } from 'src/app/models/cour.model';
import { Formateur } from 'src/app/models/formateur';
import { userDTO } from 'src/app/models/user';
import { CourService } from 'src/app/services/cour.service';
import { FormateurService } from 'src/app/services/formateur.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-formateur-cours',
  templateUrl: './list-formateur-cours.component.html',
  styleUrls: ['./list-formateur-cours.component.scss']
})
export class ListFormateurCoursComponent implements OnInit {
  cours$: Observable<Cour[]> | undefined;
  formateur: Formateur | null = null;
  user: userDTO | null = null;
  formateurId: number = 0;
  loading: boolean = true; // Define 'loading' property

  constructor(
    @Inject(CourService) private courService: CourService,
    @Inject(UserService) private userService: UserService,
    @Inject(FormateurService) private formateurService: FormateurService,
    @Inject(Router)  private router: Router
  ) {}

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
        // Log the entire response object to the console for debugging
        console.log('Response Object:', data);

        // Extract the Formateur ID from the response directly
        this.formateurId = data.formateurId; // Assign formateurId from response
        console.log('Formateur ID:', this.formateurId); // Log formateurId

        // Now you can use the formateurId as needed
        this.loading = false; // Set loading to false after data is loaded
        return this.courService.getCoursByFormateurId(this.formateurId); // Fetch cours data
      }),
      catchError(error => {
        console.error('Error fetching cours:', error);
        this.loading = false; // Set loading to false on error
        return throwError('Error fetching cours');
      })
    ).subscribe(cours => {
      this.cours$ = of(cours); // Set cours$ observable with fetched data
    });
  }

  editCour(cour: Cour): void {
    // Handle edit action
    console.log('Editing Cour:', cour);
  }

  deleteCour(cour: Cour): void {
    if (confirm('Are you sure you want to delete this cour?')) {
      this.courService.deleteCour(cour.courId!).subscribe(
        () => {
          console.log('Cour deleted successfully.');
          // Optionally, you can reload the cours data after deletion
          this.reloadCoursData();
        },
        (error) => {
          console.error('Error deleting cour:', error);
          // Handle error as needed, such as displaying an error message
        }
      );
    }
  }
  
  reloadCoursData(): void {
    // Reload the cours data after deletion
    this.courService.getCoursByFormateurId(this.formateurId).subscribe(
      (cours) => {
        this.cours$ = of(cours); // Update cours$ observable with new data
      },
      (error) => {
        console.error('Error reloading cours data:', error);
        // Handle error as needed
      }
    );
  }
  
  viewCourDetails(courId: number): void {
    // Navigate to another component and pass courId as a parameter
    this.router.navigate(['/ui-components/cour-details', courId]);
  }
}
