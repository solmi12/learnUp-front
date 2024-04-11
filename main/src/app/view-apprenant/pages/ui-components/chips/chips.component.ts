import { Component, Inject, OnInit } from '@angular/core';
import { catchError, switchMap, throwError, type Observable } from 'rxjs';
import type { QuestionReponse } from 'src/app/models/QuestionReponse';
import { Formateur } from 'src/app/models/formateur';
import type { userDTO } from 'src/app/models/user';
import { FormateurService } from 'src/app/services/formateur.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-chips-apprenant',
  templateUrl: './chips-apprenant.component.html',
  styleUrls: ['./chips-apprenant.component.scss'],
})
export class AppChipsApprenantComponent implements OnInit {
  user: userDTO | null = null;
  apprenantId: number = 0;
  loading: boolean = true;
  questionResponses$: Observable<QuestionReponse[]>;
  formateurs: Formateur[] = [];
  formateurQuestionReponses: { [formateurId: number]: QuestionReponse[] } = {}; 
  formateurIds: number[] = []; 

  newQuestions: { [key: number]: string } = {};

  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(QuestionResponseService) private questionReponseService: QuestionResponseService,
    @Inject(FormateurService) private formateurService: FormateurService,
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
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
        this.apprenantId = data.apprenantId;
        this.loading = false;
        this.questionResponses$ = this.questionReponseService.getReponseByApprenantId(this.apprenantId);
        return this.questionResponses$;
      }),
      catchError((error) => {
        console.error('Error fetching apprenant:', error);
        this.loading = false;
        return throwError('Error fetching apprenant');
      })
    ).subscribe(
      (questionResponses: QuestionReponse[]) => {
        this.groupQuestionReponsesByFormateur(questionResponses);
      }
    );
  }

  groupQuestionReponsesByFormateur(questionResponses: QuestionReponse[]): void {
    for (const response of questionResponses) {
      if (!this.formateurIds.includes(response.formateurId)) {
        this.formateurIds.push(response.formateurId);
        this.formateurService.getFormateurById(response.formateurId).subscribe(
          (formateur: Formateur) => {
            this.formateurs.push(formateur);
          }
        );
      }
      if (!this.formateurQuestionReponses[response.formateurId]) {
        this.formateurQuestionReponses[response.formateurId] = [];
      }
      this.formateurQuestionReponses[response.formateurId].push(response);
    }
  }
  getFormateurFullName(formateurId: number): string {
    const formateur = this.formateurs.find(formateur => formateur.formateurId === formateurId);
    return formateur ? formateur.fullName : 'Unknown Formateur';
  }
  
  addQuestionResponse(formateurId: number, question: string): void {
    const apprenantId = this.apprenantId; 
  
    const questionResponse: QuestionReponse = {
      qaId: 0,
      formateurId: formateurId,
      apprenantId: apprenantId,
      needsReview: true,
      question: question,
      reponse: '',
      addedDate: new Date()
    };
  
    this.questionReponseService.addQuestion(questionResponse).subscribe(
      (result: QuestionReponse) => {
        console.log('Question response added:', result);
        // Optionally, you can update the UI or show a success message here
      },
      (error) => {
        console.error('Error adding question response:', error);
        // Optionally, you can handle errors and show an error message to the user
      }
    );
  
    // Clear the input field after sending the question
    this.newQuestions[formateurId] = '';
  }
  
}
