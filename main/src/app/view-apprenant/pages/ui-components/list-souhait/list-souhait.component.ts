import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import type { SouhaitsDto } from 'src/app/models/SouhaitsDto';
import type { Cour } from 'src/app/models/cour.model';
import { ApprenantCourService } from 'src/app/services/apprenant-cour.service';
import { AuthServiceService } from 'src/app/services/auth-service.service';
import { CourService } from 'src/app/services/cour.service';
import { SouhaitsService } from 'src/app/services/souhaits.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-souhait',
  templateUrl: './list-souhait.component.html',
  styleUrls: ['./list-souhait.component.scss']
})
export class ListSouhaitComponent {
  apprenantId: number = 0;
  private destroy$: Subject<void> = new Subject<void>();
  souhaitList: SouhaitsDto[] = [];
  courList: Cour[] = [];

  constructor(
    @Inject(ApprenantCourService) private apprenantCourService: ApprenantCourService,
    @Inject(AuthServiceService) private authService: AuthServiceService,
    @Inject(Router) private router: Router,
    @Inject(UserService) private userService: UserService,
    @Inject(CourService) private courService: CourService,
    
   @Inject(SouhaitsService)private souhaitsService:SouhaitsService
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
        switchMap(() => this.souhaitsService.getSouhaitsByApprenantId(this.apprenantId))
      ).subscribe((souhaitCourses: SouhaitsDto[]) => {
        this.souhaitList =souhaitCourses;

        // Extract courIds from apprenantCourList
        const courIds = souhaitCourses.map(apprenantCourse => apprenantCourse.courId);
        
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
