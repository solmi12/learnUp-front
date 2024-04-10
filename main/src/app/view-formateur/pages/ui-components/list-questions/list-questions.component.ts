import { Component, Inject, OnInit } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Formateur } from 'src/app/models/formateur';
import { userDTO } from 'src/app/models/user';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { UserService } from 'src/app/services/user.service';
import { Observable } from 'rxjs';
import { QuestionReponse } from 'src/app/models/QuestionReponse';
import { Apprenant } from 'src/app/models/Apprenant'; // Import Apprenant model
import { StudentService } from 'src/app/services/student.service'; // Import StudentService

@Component({
  selector: 'app-list-questions',
  templateUrl: './list-questions.component.html',
  styleUrls: ['./list-questions.component.scss']
})
export class ListQuestionsComponent implements OnInit {
  user: userDTO | null = null;
  formateurId: number = 0;
  loading: boolean = true;
  formateur: Formateur | null = null;
  questionResponses$: Observable<QuestionReponse[]>;
  apprenant$: Observable<Apprenant>; // Observable for Apprenant
  newResponse: string = '';
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(QuestionResponseService) private questionReponseService: QuestionResponseService,
    @Inject(StudentService) private studentService: StudentService 
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
    
        this.apprenant$ = this.studentService.getStudentById(data.apprenantId);
        console.log('apprenanr',this.apprenant$)
        return this.questionResponses$;
      }),
      catchError(error => {
        console.error('Error fetching admin:', error);
        this.loading = false;
        return throwError('Error fetching admin');
      })
    ).subscribe(
      (questionResponses: QuestionReponse[]) => {
        console.log(questionResponses);
      }
    );
  }
  updateResponse(response: QuestionReponse, newResponse: string): void {
    const updatedResponse: QuestionReponse = { ...response, reponse: newResponse };
    this.questionReponseService.updateQuestionReponse(response.qaId, updatedResponse).subscribe(
      updatedResponse => {
        console.log('Updated response:', updatedResponse);
      },
      error => {
        console.error('Error updating response:', error);
      }
    );
  }
  
  
}
