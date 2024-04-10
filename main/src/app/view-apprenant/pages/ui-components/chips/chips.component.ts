import { Component, Inject, OnInit } from '@angular/core'; // Update with the correct path
import { switchMap, type Observable, catchError, throwError } from 'rxjs';
import type { Apprenant } from 'src/app/models/Apprenant';
import type { QuestionReponse } from 'src/app/models/QuestionReponse';
import type { Formateur } from 'src/app/models/formateur';
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
  apprenant: Apprenant| null = null;
  questionResponses$: Observable<QuestionReponse[]>;
formateurId: number = 1;
  question: string = ''; 
  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(QuestionResponseService) private questionReponseService: QuestionResponseService,){}

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

}
