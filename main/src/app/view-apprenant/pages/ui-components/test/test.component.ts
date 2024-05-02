import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { QuizDto } from 'src/app/models/Quiz'; // Assuming QuizDto is imported correctly
import { QuizService } from 'src/app/services/quiz.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  quizId: number | undefined;
  quiz: QuizDto | undefined;
  userResponses: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private quizService: QuizService,
    @Inject(MatDialog) private dialog: MatDialog 
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const courId = +params['id']; 
      if (courId) {
        this.quizService.getQuizByCourId(courId).subscribe(quiz => {
          this.quiz = quiz;
        });
      }
    });
  }

  setUserResponse(index: number, response: string): void {
    this.userResponses[index] = response;
  }

  checkUserResponse(): void {
    if (this.quiz) {
      const quizResponse: QuizDto = {
        courId: this.quiz.courId,
        questions: this.quiz.questions,
        correctResponses: this.quiz.correctResponses,
        falseResponses: this.quiz.falseResponses,
        userResponses: this.userResponses,
        isCorrect: []
      };
  
      this.quizService.checkUserResponse(quizResponse).subscribe(response => {
        console.log('User response checked:', response);
        if (response) {
          this.openSuccessDialog(); 
        } else {
          this.openFailureDialog(); 
        }
      });
    }
  }
  
  openSuccessDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { isSuccess: true } 
    });
  }
  
  openFailureDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: { isSuccess: false } 
    });
  }
  
}
