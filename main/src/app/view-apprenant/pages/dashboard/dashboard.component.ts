import { Component, ViewEncapsulation, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexStroke,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  ApexMarkers,
  ApexResponsive,
} from 'ng-apexcharts';
import { catchError, switchMap, throwError, type Observable, map, of } from 'rxjs';
import type { Apprenant } from 'src/app/models/Apprenant';
import type { ApprenantCour } from 'src/app/models/ApprenantCour';
import type { Category, Cour } from 'src/app/models/cour.model';
import { ApprenantCourService } from 'src/app/services/apprenant-cour.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CourService } from 'src/app/services/cour.service';
import { StudentService } from 'src/app/services/student.service';
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

  constructor(@Inject(CourService) private courService:CourService,@Inject(AuthServiceService)private authService: AuthServiceService
  , @Inject(Router) private router: Router,
  @Inject(UserService) private userService: UserService,
  @Inject (StudentService) private apprenantService:StudentService,
  @Inject(ApprenantCourService) private apprenantCourService:ApprenantCourService) {
   
 

  }
  ngOnInit(): void {
    this.getCategories(); // Fetch categories first if needed
  
    const storedId = localStorage.getItem('userId');
    console.log('Stored ID:', storedId);
    const userId = parseInt(storedId || '', 10); // Parse to integer with base 10
    if (!isNaN(userId)) {
      this.getUserDetails(userId);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }
  
  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        this.apprenantId = data.apprenantId;
        console.log('Apprenant ID:', this.apprenantId);
        return this.apprenantCourService.getCoursApprenantByApprenantId(this.apprenantId);
      })
    ).subscribe((courses: ApprenantCour[]) => {
      console.log('Courses for Apprenant:', courses);
      // Now that you have the courses for the apprenant, fetch the accepted courses
      this.getAcceptedCourses();
    });
  }
  
  

  


  

  

  addApprenantCour(courId: number): void {
    const apprenantCour = {
      apprenantCourid: 0, 
      apprenantId: this.apprenantId,
      courId: courId,
      addedDate: new Date() 
    };
    this.apprenantCourService.addApprenantCour(apprenantCour).subscribe(
      (result) => {
        console.log('Course added to ApprenantCour:', result);
        // Optionally, you can update the UI or perform any additional logic here
      },
      (error) => {
        console.error('Error adding Cour to ApprenantCour:', error);
      }
    );
  }
  
  deleteApprenantCour(courId: number): void {
    this.apprenantCourService.deleteApprenantCour(courId).subscribe(
      () => {
        console.log('Course deleted from ApprenantCour');
        // Optionally, you can update the UI or perform any additional logic here
      },
      (error) => {
        console.error('Error deleting course from ApprenantCour:', error);
      }
    );
  }
  
    
  viewCourDetails(courId: number): void {
    // Navigate to another component and pass courId as a parameter
    this.router.navigate(['/ui-components/cour', courId]);
  }
  getAcceptedCourses(): void {
    this.courService.getAcceptedCourses().subscribe(
      (courses: Cour[]) => {
        this.cour = courses; // Update cour with the fetched courses directly
        console.log('Accepted courses:', this.cour); 
      },
      (error) => {
        console.error('Error fetching accepted courses:', error);
      }
    );
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
      this.categories = Array.from(new Set(cour.map(cour =>cour.category?.categoryName)))
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
}
