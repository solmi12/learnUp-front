import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog for displaying the notification pop-up
import { VideoCallComponent } from '../video-call/video-call.component';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;

  constructor(private dialog: MatDialog) {
    this.socket = io('http://localhost:8000');

    // Subscribe to notifyFormateur event
    this.socket.on('notifyFormateur', (notification: any) => {
      this.showVideoCallNotification(notification.formateurId, notification.formateurName);
    });
  }

  joinRoom(apprenantId: number, formateurId: number) {
    this.socket.emit('joinRoom', { apprenantId, formateurId });
  }

  sendEvent(eventName: string, eventData: any) {
    this.socket.emit(eventName, eventData);
  }

  notifyFormateur(formateurId: number, formateurName: string): void {
    this.socket.emit('notifyFormateur', { formateurId, formateurName });
  }

  onEvent(event: string): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on(event, (data: any) => observer.next(data));
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  private showVideoCallNotification(formateurId: number, formateurName: string): void {
    const dialogRef = this.dialog.open(VideoCallComponent, {
      data: { formateurId, formateurName },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.sendEvent('videoCallResponse', { formateurId, accepted: true });
      } else {
        this.sendEvent('videoCallResponse', { formateurId, accepted: false });
      }
    });
  }
}
