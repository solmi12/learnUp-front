import { Component, Inject, OnInit } from '@angular/core';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import type { Apprenant } from 'src/app/models/Apprenant';
import { QuestionReponse } from 'src/app/models/QuestionReponse';
import { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { StudentService } from 'src/app/services/student.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss']
})
export class ListQuestionsComponent implements OnInit {
  formateurId: number = 0;
  apprenantIds: number[] = [];
  loading: boolean = true;
  response: QuestionReponse;
  questionResponses$: Observable<QuestionReponse[]>;
  formateurs: Formateur[] = [];
  apprenants: Apprenant[] = [];
  formateurQuestionReponses: { [formateurId: number]: QuestionReponse[] } = {};
  updatedResponse: string = '';
  apprenantQuestionReponses: { [apprenantId: number]: QuestionReponse[] } = {};
  newQuestions: { [key: number]: string } = {};

  constructor(
    @Inject(FormateurService) private formateurService: FormateurService,
    
    @Inject(StudentService) private apprenantService: StudentService,
    @Inject(QuestionResponseService) private questionReponseService: QuestionResponseService,
    
    @Inject(UserService) private userService: UserService,
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
        this.formateurId = data.formateurId;
        this.loading = false;
        this.questionResponses$ = this.questionReponseService.getReponseByFormateurId(this.formateurId);
        return this.questionResponses$;
      }),
      catchError((error) => {
        console.error('Error fetching apprenant:', error);
        this.loading = false;
        return throwError('Error fetching apprenant');
      })
    ).subscribe(
      (questionResponses: QuestionReponse[]) => {
        this.groupQuestionReponsesByApprenant(questionResponses);
        const apprenantId = this.apprenantIds.length > 0 ? this.apprenantIds[0] : 0;
      
      }
    );
  }

  groupQuestionReponsesByApprenant(questionResponses: QuestionReponse[]): number[] {
    const addedApprenantIds: number[] = [];
    for (const response of questionResponses) {
      if (!this.apprenantIds.includes(response.apprenantId)) {
        this.apprenantIds.push(response.apprenantId);
        addedApprenantIds.push(response.apprenantId);
        this.apprenantService.getStudentById(response.apprenantId).subscribe(
          (apprenant: Apprenant) => {
            this.apprenants.push(apprenant);
          }
        );
      }
      if (!this.apprenantQuestionReponses[response.apprenantId]) {
        this.apprenantQuestionReponses[response.apprenantId] = [];
      }
      this.apprenantQuestionReponses[response.apprenantId].push(response);
    }
    return addedApprenantIds;
  }

  getFormateurFullName(formateurId: number): string {
    const formateur = this.formateurs.find(formateur => formateur.formateurId === formateurId);
    return formateur ? formateur.fullName : 'Unknown Formateur';
  }

  updateQuestionResponse(updatedResponse: string): void {
    this.questionResponses$.subscribe((responses: QuestionReponse[]) => {
      const lastResponse = responses[responses.length - 1]; // Get the last response from the array
      const updatedQuestionResponse: QuestionReponse = { ...lastResponse, reponse: updatedResponse };
      this.questionReponseService.updateQuestionReponse(lastResponse.qaId, updatedQuestionResponse).subscribe(
        (result: QuestionReponse) => {
          console.log('Question response updated:', result);
        },
        (error) => {
          console.error('Error updating question response:', error);
        }
      );
    });
  }
  
}
