import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, tap, Subject, switchMap } from 'rxjs';
import { ApprenantCourService } from 'src/app/services/apprenant-cour.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { UserService } from 'src/app/services/user.service';
import { Cour } from 'src/app/models/cour.model';
import { CourService } from 'src/app/services/cour.service';
import type { ApprenantCourDto } from 'src/app/models/ApprenantCour';

@Component({
  selector: 'app-mes-apprentissages',
  templateUrl: './mes-apprentissages.component.html',
  styleUrls: ['./mes-apprentissages.component.scss']
})
export class MesApprentissagesComponent implements OnInit {
  apprenantId: number = 0;
  private destroy$: Subject<void> = new Subject<void>();
  apprenantCourList: ApprenantCourDto[] = [];
  courList: Cour[] = [];

  constructor(
    @Inject(ApprenantCourService) private apprenantCourService: ApprenantCourService,
    @Inject(AuthServiceService) private authService: AuthServiceService,
    @Inject(Router) private router: Router,
    @Inject(UserService) private userService: UserService,
    @Inject(CourService) private courService: CourService // Inject CourService here
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    const userId = parseInt(storedId || '', 10);

    if (!isNaN(userId)) {
      this.userService.getUserById(userId).pipe(
        takeUntil(this.destroy$),
        tap((user: any) => {
          this.apprenantId = user.apprenantId;
        }),
        switchMap(() => this.apprenantCourService.getCoursApprenantByApprenantId(this.apprenantId))
      ).subscribe((apprenantCourses: ApprenantCourDto[]) => {
        this.apprenantCourList = apprenantCourses;

        // Extract courIds from apprenantCourList
        const courIds = apprenantCourses.map(apprenantCourse => apprenantCourse.courId);
        
        // Fetch Cour objects for each courId
        courIds.forEach(courId => {
          this.courService.getByCourId(courId).subscribe(cour => {
            this.courList.push(cour);
          });
        });
      });
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }

  viewCourDetails(courId: number): void {
    // Navigate to another component and pass courId as a parameter
    this.router.navigate(['/ui-components/cour', courId]);
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
