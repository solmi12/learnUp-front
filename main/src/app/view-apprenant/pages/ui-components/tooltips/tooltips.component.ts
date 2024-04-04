import { Component, Inject, type OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, type Observable, map, catchError, Subject, takeUntil } from 'rxjs';
import type { Chapitre } from 'src/app/models/Chapitre';
import type { QuestionReponse } from 'src/app/models/QuestionReponse';
import type { Cour } from 'src/app/models/cour.model';
import { ApprenantCourService } from 'src/app/services/apprenant-cour.service';
import { ChapitreService } from 'src/app/services/chapitre.service';
import { CourService } from 'src/app/services/cour.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss']
})
export class AppTooltipsComponent implements OnInit{
 
  courAdded$: Observable<boolean> = of(false); // Default value
  private destroy$: Subject<void> = new Subject<void>();
  courId: number = 0; 
  cour:Cour | null = null;
  chapitres: Chapitre[] = [];
  showAddChapitreFormFlag: boolean = false;
  chapitre={
    chapitreId:null,
    titre:'',
    description:'',
    dureeEstimee:0,
    progressionComplete:false,
    ordreDansLeCours:0,
    pdfAttachment:'',
    imageData:'',
    courId:0,
    youtubeVideoLink:''
  }
  messageToSend: string = ''; 
  courIdToCheck: number = 1; 
  apprenantId: number = 0;
  loading: boolean = false; 
  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(CourService) private courService: CourService,
    @Inject(ChapitreService) private chapitreService: ChapitreService,
    @Inject(UserService) private userService: UserService,
    @Inject(QuestionResponseService) private questionReponseService:QuestionResponseService,
    @Inject(ApprenantCourService) private apprenantCourService:ApprenantCourService,
   @Inject(DomSanitizer) private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      this.courId = params['id'];
      if (this.courId) {
        this.getUserDetails();
      }
    });
    this.getChapitres(this.courId)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

 getUserDetails(): void {
  const storedId = localStorage.getItem('userId');
  console.log('Stored ID:', storedId);
  const userId = parseInt(storedId || '', 10); // Parse to integer with base 10

  if (!isNaN(userId)) {
    this.userService.getUserById(userId).pipe(
      takeUntil(this.destroy$),
      switchMap((user: any) => {
        this.apprenantId = user.apprenantId;
        console.log('Apprenant ID:', this.apprenantId);
        return this.apprenantCourService.getCoursByApprenantId(this.apprenantId);
      })
    ).subscribe((courses: Cour[]) => {
      console.log('Courses for Apprenant:', courses);
      // Now that you have the courses for the apprenant, fetch the accepted courses
      this.getCourDetails(this.courId);
    });
  } else {
    console.error('Invalid user ID stored in localStorage');
  }
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

  


  
  sanitizePdf(pdfData: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${pdfData}`);
  }

  getCourDetails(courId: number): void {
    this.courService.getByCourId(courId).pipe(
      switchMap((data: Cour) => {
        console.log('Response Object:', data);
        this.loading = false; // Set loading to false after data is fetched
        this.cour = data;
  
        // Extract formateurId from the cour data
        const formateurId = data.formateurId;
        console.log('Formateur ID:', formateurId);
  
        return of(data);
      })
    ).subscribe();
  }

  addQuestionResponse(formateurId: number, apprenantId: number, message: string): void {
    const questionResponse: QuestionReponse = {
      qaId:0,
      formateurId: formateurId,
      apprenantId: apprenantId,
      needsReview:true,
      message: message,
      addedDate: new Date()
    };
  
    this.questionReponseService.addQuestion(questionResponse).subscribe(
      (result: QuestionReponse) => {
        console.log('Question response added:', result);
        // Optionally, you can update the UI or perform any additional logic here
      },
      (error) => {
        console.error('Error adding question response:', error);
      }
    );
  }
  
  sendMessage(): void {
    if (this.messageToSend.trim() !== '') {
      // Call your method to add the question response with the message
      this.addQuestionResponse(this.cour!.formateurId, this.apprenantId, this.messageToSend);
  
      // Optionally, you can reset the input field after sending the message
      this.messageToSend = '';
    }
  }
  
  getChapitres(courId: number): void {
    this.chapitreService.getChapitresByCourId(courId).subscribe(
      (data: Chapitre[]) => {
        this.chapitres = data; // Assign array of Chapitre objects to chapitres property
      },
      (error) => {
        console.error('Error fetching chapitres:', error);
      }
    );
  }

  showAddChapitreForm(): void {
    this.showAddChapitreFormFlag = true;
  }

}
