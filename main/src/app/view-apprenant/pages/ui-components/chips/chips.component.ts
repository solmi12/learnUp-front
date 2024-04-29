import { Component, Inject, OnInit } from '@angular/core';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { QuestionReponse } from 'src/app/models/QuestionReponse';
import { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';
import { QuestionResponseService } from 'src/app/services/question-response.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { VideoCallComponent } from 'src/app/video-call/video-call.component';

@Component({
  selector: 'app-chips-apprenant',
  templateUrl: './chips-apprenant.component.html',
  styleUrls: ['./chips-apprenant.component.scss'],
})
export class AppChipsApprenantComponent implements OnInit {
  apprenantId: number = 0;
  loading: boolean = true;
  questionResponses$: Observable<QuestionReponse[]>;
  formateurs: Formateur[] = [];
  formateurQuestionReponses: { [formateurId: number]: QuestionReponse[] } = {};
  formateurIds: number[] = [];
  formateur: Formateur | null = null;
  newQuestions: { [key: number]: string } = {};

  videoCallInProgress: boolean = false;

  constructor(
    @Inject(UserService) private userService: UserService,
    @Inject(QuestionResponseService) private questionReponseService: QuestionResponseService,
    @Inject(FormateurService) private formateurService: FormateurService,
    @Inject(SocketService) private socketService: SocketService,
    @Inject(MatDialog) private dialog: MatDialog
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

  triggerVideoCall(formateurId: number): void {
    if (this.videoCallInProgress) {
      console.log('A video call is already in progress.');
      return;
    }
  
    // Send notification to formateur
    this.socketService.notifyFormateur(formateurId, this.formateur ? this.formateur.fullName : 'Unknown Formateur');
  
    // Handle response from formateur
    this.socketService.onEvent('videoCallResponse').subscribe((response: any) => {
      if (response.accepted) {
        // Formateur accepted the call, start the video call
        this.startVideoCall(formateurId);
      } else {
        console.log('Formateur declined the call.');
        // Handle UI for declined call
      }
    });
  
    // Notify formateur about the video call
    this.socketService.sendEvent('initiateVideoCall', { formateurId: formateurId, apprenantId: this.apprenantId });
  }
  

  initiateVideoCall(formateurId: number): void {
    if (this.videoCallInProgress) {
      console.log('A video call is already in progress.');
      return;
    }

    this.socketService.notifyFormateur(formateurId, this.formateur ? this.formateur.fullName : 'Unknown Formateur');
    this.videoCallInProgress = true;

    const dialogRef = this.dialog.open(VideoCallComponent, {
      data: { formateurId: formateurId },
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined) {
        console.log('Video call dialog closed without result.');
      } else {
        console.log('Video call dialog closed with result:', result);
      }
    });
  }

  startVideoCall(formateurId: number): void {
    this.initiateVideoCall(formateurId);
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
        const formateurId = this.formateurIds.length > 0 ? this.formateurIds[0] : 0;
        if (formateurId) {
          this.triggerVideoCall(formateurId);
        }
      }
    );
  }

  groupQuestionReponsesByFormateur(questionResponses: QuestionReponse[]): number[] {
    const addedFormateurIds: number[] = [];
    for (const response of questionResponses) {
      if (!this.formateurIds.includes(response.formateurId)) {
        this.formateurIds.push(response.formateurId);
        addedFormateurIds.push(response.formateurId);
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
    return addedFormateurIds;
  }

  getFormateurFullName(formateurId: number): string {
    const formateur = this.formateurs.find(formateur => formateur.formateurId === formateurId);
    return formateur ? formateur.fullName : 'Unknown Formateur';
  }

  addQuestionResponse(formateurId: number, question: string): void {
    const questionResponse: QuestionReponse = {
      qaId: 0,
      formateurId: formateurId,
      apprenantId: this.apprenantId,
      needsReview: true,
      question: question,
      reponse: '',
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

    this.newQuestions[formateurId] = '';
  }

}
