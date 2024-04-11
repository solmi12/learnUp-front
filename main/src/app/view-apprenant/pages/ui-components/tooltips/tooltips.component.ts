import { Component, Inject, type OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { of, switchMap, type Observable, map, catchError, Subject, takeUntil, tap, forkJoin } from 'rxjs';
import type { ApprenantCour } from 'src/app/models/ApprenantCour';
import type { Chapitre } from 'src/app/models/Chapitre';
import type { QuestionReponse } from 'src/app/models/QuestionReponse';
import type { SouhaitsDto } from 'src/app/models/SouhaitsDto';
import type { Cour } from 'src/app/models/cour.model';
import { ApprenantCourService } from 'src/app/services/apprenant-cour.service';
import { ChapitreService } from 'src/app/services/chapitre.service';
import { CourService } from 'src/app/services/cour.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { SouhaitsService } from 'src/app/services/souhaits.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss']
})
export class AppTooltipsComponent implements OnInit{
  matchedCourse: ApprenantCour | undefined;
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
  question: string = ''; 
  courIdToCheck: number = 1; 
  isCourseAdded: boolean = false;
  isSouhaitsAdded:boolean = false;
  matchedSouhait: SouhaitsDto | undefined;
  apprenantId: number = 0;
  loading: boolean = false; 
  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(CourService) private courService: CourService,
    @Inject(ChapitreService) private chapitreService: ChapitreService,
    @Inject(UserService) private userService: UserService,
    @Inject(QuestionResponseService) private questionReponseService:QuestionResponseService,
    @Inject(ApprenantCourService) private apprenantCourService:ApprenantCourService,
   @Inject(DomSanitizer) private sanitizer: DomSanitizer,
   @Inject(SouhaitsService)private souhaitsService:SouhaitsService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courId = +params['id']; 
      if (this.courId) {
        this.getUserDetails(); 
      }
    });
    this.getChapitres(this.courId);
  }

  getUserDetails(): void {
    const storedId = localStorage.getItem('userId');
    const userId = parseInt(storedId || '', 10); 
  
    if (!isNaN(userId)) {
      this.userService.getUserById(userId).pipe(
        takeUntil(this.destroy$),
        switchMap((user: any) => {
          this.apprenantId = user.apprenantId;
  
          return forkJoin([
            this.apprenantCourService.getCoursApprenantByApprenantId(this.apprenantId),
            this.souhaitsService.getSouhaitsByApprenantId(this.apprenantId)
          ]).pipe(
            tap(([apprenantCourses, souhaitsList]) => {
              console.log('apprenantCourses:', apprenantCourses);
              console.log('souhaitsList:', souhaitsList);
            }),
            switchMap(([apprenantCourses, souhaitsList]) => {
              const matchedCourse = apprenantCourses?.find((apprenantCour :ApprenantCour) =>apprenantCour.courId === this.courId && apprenantCour.apprenantId === this.apprenantId)
              console.log('MatchedCourse:', matchedCourse);
              if (matchedCourse) {
                console.log('ApprenantCour ID:', matchedCourse.apprenantCourid);
                console.log('Apprenant ID:', matchedCourse.apprenantId);
                console.log('Cour ID:', matchedCourse.courId);
                console.log('Added Date:', matchedCourse.addedDate);
                this.isCourseAdded = true; 
              } else {
                console.log('No matching ApprenantCour found for courId:', this.courId, 'and apprenantId:', this.apprenantId);
                this.isCourseAdded = false;
              }
  
              this.matchedCourse = matchedCourse;
              
              const matchedSouhait = souhaitsList?.find((souhait: SouhaitsDto) => souhait.courId === this.courId);
  
              console.log('MatchedSouhait:', matchedSouhait);
              this.matchedSouhait = matchedSouhait;
              this.isSouhaitsAdded = !!matchedSouhait;
  
              return of(apprenantCourses); 
            })
          );
        })
      ).subscribe(() => {
        this.getCourDetails(this.courId);
      });
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }
  
  
 
  
  addApprenantCour(courId: number): void {
    const apprenantCour : ApprenantCour= {
      apprenantCourid: 0,
      apprenantId: this.apprenantId,
      courId: courId,
      addedDate: '',
    };
    this.apprenantCourService.addApprenantCour(apprenantCour).subscribe(
      (result) => {
        console.log('Course added to ApprenantCour:', result);
        this.isCourseAdded = true; 
      },
      (error) => {
        console.error('Error adding Cour to ApprenantCour:', error);
      }
    );
  }

  addNewSouhait(courId: number): void {
    const newSouhait: SouhaitsDto = {
      souhaitId: 0, // Set appropriate values for your SouhaitsDto object
      apprenantId: this.apprenantId,
      courId: courId,
    };

    this.souhaitsService.addSouhait(newSouhait).subscribe(
      (response) => {
        console.log('New Souhait added:', response);
        this.isSouhaitsAdded = true;
      },
      (error) => {
        console.error('Error adding Souhait:', error);
        // Handle error, display error message, etc.
      }
    );
  }
  deleteSouhait(): void {
    console.log('Deleting ApprenantCour...');
    console.log('MatchedSouhait:', this.matchedSouhait); // Debugging
  
    if (this.matchedSouhait) {
      const souhaitId = this.matchedSouhait.souhaitId;
  
      this.souhaitsService.deleteSouhait(souhaitId).subscribe(
        () => {
          console.log('Course deleted from ApprenantCour');
          this.isSouhaitsAdded = false; // Update isCourseAdded after successful deletion
        },
        (error) => {
          console.error('Error deleting course from ApprenantCour:', error);
        }
      );
    } else {
      console.error('No matching Souhait found to delete.');
    }
  }
  
  deleteApprenantCour(): void {
    console.log('Deleting ApprenantCour...');
    console.log('MatchedCourse:', this.matchedCourse); 

    if (this.matchedCourse) {
      const apprenantCourId = this.matchedCourse.apprenantCourid;

      this.apprenantCourService.deleteApprenantCour(apprenantCourId).subscribe(
        () => {
          console.log('Course deleted from ApprenantCour');
          this.isCourseAdded = false; 
        },
        (error) => {
          console.error('Error deleting course from ApprenantCour:', error);
        }
      );
    } else {
      console.error('No matching ApprenantCour found to delete.');
    }
  }

  
  sanitizePdf(pdfData: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${pdfData}`);
  }

  getCourDetails(courId: number): void {
    this.courService.getByCourId(courId).pipe(
      switchMap((data: Cour) => {
        console.log('Response Object:', data);
        this.loading = false; 
        this.cour = data;
  
        const formateurId = data.formateurId;
        console.log('Formateur ID:', formateurId);
  
        return of(data);
      })
    ).subscribe();
  }

  addQuestionResponse(formateurId: number, apprenantId: number, question: string): void {
    const questionResponse: QuestionReponse = {
      qaId:0,
      formateurId: formateurId,
      apprenantId: apprenantId,
      needsReview:true,
      question: question,
      reponse:'',
      addedDate: new Date()
    };
  
    this.questionReponseService.addQuestion(questionResponse).subscribe(
      (result: QuestionReponse) => {
        console.log('Question response added:', result);
      
      },
      (error) => {
        console.error('Error adding question response:', error);
      }
    );
  }
  
  sendMessage(): void {
    if (this.question.trim() !== '') {
      this.addQuestionResponse(this.cour!.formateurId, this.apprenantId, this.question);
  
      this.question = '';
    }
  }
  getYouTubeThumbnail(videoLink: string): string {

    const videoId = this.extractVideoId(videoLink);

    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  
  private extractVideoId(videoLink: string): string {
    const videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = videoLink.match(videoIdRegex);
    if (match && match.length > 1) {
      return match[1];
    }
    return '';
  }
  getChapitres(courId: number): void {
    this.chapitreService.getChapitresByCourId(courId).subscribe(
      (data: Chapitre[]) => {
        this.chapitres = data; 
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
