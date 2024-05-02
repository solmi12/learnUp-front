import { Component, Inject, type OnInit } from '@angular/core';
import { FormBuilder, Validators, type FormArray, type FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import type { Observable } from 'rxjs';
import type { QuizDto } from 'src/app/models/Quiz';
import { ChapitreService } from 'src/app/services/chapitre.service';
import { CourService } from 'src/app/services/cour.service';
import { QuizService } from 'src/app/services/quiz.service';

@Component({
  selector: 'app-add-quiz',
  templateUrl: './add-quiz.component.html',
  styleUrls: ['./add-quiz.component.scss']
})
export class AddQuizComponent implements OnInit{

  courId: number = 0; 

  displayForm: boolean = true; 
  quizForm: FormGroup;
  quizzes: QuizDto[] = [];
  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(CourService) private courService: CourService,
    @Inject(ChapitreService) private chapitreService: ChapitreService,
    @Inject(FormBuilder) private fb: FormBuilder,
   @Inject(DomSanitizer) private sanitizer: DomSanitizer,
   @Inject(QuizService) private quizService:QuizService
  ) {
    this.quizForm = this.fb.group({
      question1: ['', Validators.required],
      correctResponse1: ['', Validators.required],
      falseResponse1_1: ['', Validators.required],
      falseResponse1_2: ['', Validators.required],
      falseResponse1_3: ['', Validators.required],
      question2: ['', Validators.required],
      correctResponse2: ['', Validators.required],
      falseResponse2_1: ['', Validators.required],
      falseResponse2_2: ['', Validators.required],
      falseResponse2_3: ['', Validators.required],
      question3: ['', Validators.required],
      correctResponse3: ['', Validators.required],
      falseResponse3_1: ['', Validators.required],
      falseResponse3_2: ['', Validators.required],
      falseResponse3_3: ['', Validators.required],
      question4: ['', Validators.required],
      correctResponse4: ['', Validators.required],
      falseResponse4_1: ['', Validators.required],
      falseResponse4_2: ['', Validators.required],
      falseResponse4_3: ['', Validators.required],
      question5: ['', Validators.required],
      correctResponse5: ['', Validators.required],
      falseResponse5_1: ['', Validators.required],
      falseResponse5_2: ['', Validators.required],
      falseResponse5_3: ['', Validators.required],
    });}

  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.courId = params['id']; // Get courId from route parameters
      if (this.courId) {
      }
    });

    this.getQuizzesByCourId();
  }



  saveQuiz(): void {
    if (this.quizForm.valid) {
      const quizDto: QuizDto = {
        courId: this.courId,
        questions: [
          this.quizForm.value.question1,
          this.quizForm.value.question2,
          this.quizForm.value.question3,
          this.quizForm.value.question4,
          this.quizForm.value.question5
        ],
        correctResponses: [
          [this.quizForm.value.correctResponse1],
          [this.quizForm.value.correctResponse2],
          [this.quizForm.value.correctResponse3],
          [this.quizForm.value.correctResponse4],
          [this.quizForm.value.correctResponse5]
        ],
        falseResponses: [
          [
            this.quizForm.value.falseResponse1_1,
            this.quizForm.value.falseResponse1_2,
            this.quizForm.value.falseResponse1_3
          ],
          [
            this.quizForm.value.falseResponse2_1,
            this.quizForm.value.falseResponse2_2,
            this.quizForm.value.falseResponse2_3
          ],
          [
            this.quizForm.value.falseResponse3_1,
            this.quizForm.value.falseResponse3_2,
            this.quizForm.value.falseResponse3_3
          ],
          [
            this.quizForm.value.falseResponse4_1,
            this.quizForm.value.falseResponse4_2,
            this.quizForm.value.falseResponse4_3
          ],
          [
            this.quizForm.value.falseResponse5_1,
            this.quizForm.value.falseResponse5_2,
            this.quizForm.value.falseResponse5_3
          ]
        ],
        userResponses: [],
        isCorrect: []
      };

      this.quizService.saveQuiz(quizDto).subscribe(
        (response: QuizDto) => {
          // Handle the response from the service
          console.log('Quiz saved successfully:', response);
        },
        (error) => {
          // Handle error if the save operation fails
          console.error('Error saving quiz:', error);
        }
      );
      console.log('Sending quiz DTO:', quizDto);
  
    } else {
      console.log('Form is invalid');
    }
  }

  getQuizzesByCourId(): void {
    this.quizService.getQuizByCourId(this.courId).subscribe(
      (data: QuizDto) => {
        this.quizzes.push(data); // Assuming you're expecting a single quiz object here
        console.log('Quizzes:', this.quizzes);
        // Set a flag to indicate whether to display the form or not
        this.displayForm = this.quizzes.length === 0;
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
        // Handle error
      }
    );
  }


}
