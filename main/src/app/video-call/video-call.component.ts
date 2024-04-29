import { Component, Inject, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-call',
  templateUrl: './video-call.component.html',
  styleUrls: ['./video-call.component.scss']
})
export class VideoCallComponent implements OnInit {
  private peerConnection: RTCPeerConnection;
  private storedFormateurId: number | undefined;
  private storedApprenantId: number | undefined;
  constructor(
    @Inject(SocketService) private socketService: SocketService,
   @Inject(MatDialogRef) public dialogRef: MatDialogRef<VideoCallComponent>, // Use MatDialogRef directly
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.initSignaling();
  }

  private initWebRTC(formateurId: number, apprenantId: number): void {
    this.peerConnection = new RTCPeerConnection();
  
    // Event listener for ICE candidates
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // Send ICE candidate and IDs to the other peer via signaling server
        this.socketService.sendEvent('candidate', { room: 'your_room_id', formateurId, apprenantId, candidate: event.candidate });
      }
    };
  
    // Event listener for receiving remote tracks
    this.peerConnection.ontrack = (event) => {
      // Handle incoming media stream tracks (e.g., video and audio)
      // You can display these tracks in your UI
    };
  
    // Add other event listeners and setup code as needed
  }
  

  private initSignaling(): void {
    this.socketService.onEvent('offer').subscribe((offer: any) => {
      const offerSignal = offer.offerSignal;
      if (!offerSignal) {
        console.error('Invalid offer signal received:', offer);
        return;
      }
  
      const remoteDescription: RTCSessionDescriptionInit = {
        type: 'offer',
        sdp: offerSignal
      };
  
      this.peerConnection.setRemoteDescription(remoteDescription)
        .then(() => {
          return this.peerConnection.createAnswer();
        })
        .then(answer => {
          return this.peerConnection.setLocalDescription(answer);
        })
        .then(() => {
          const answerSignal = this.peerConnection.localDescription;
          this.socketService.sendEvent('answer', { answer: answerSignal });
        })
        .catch(error => {
          console.error('Error handling offer:', error);
        });
    });
  }
  
  
  
  

  setStoredIds(formateurId: number, apprenantId: number): void {
    this.storedFormateurId = formateurId;
    this.storedApprenantId = apprenantId;
    if (this.storedFormateurId !== undefined && this.storedApprenantId !== undefined) {
      this.initWebRTC(this.storedFormateurId, this.storedApprenantId);
    }
  }

  handleOffer(offer: any): void {
    const formateurId = offer.formateurId;
    const apprenantId = offer.apprenantId;
    const offerSignal = offer.offerSignal;
  
    // Initialize WebRTC connection with received IDs
    this.setStoredIds(formateurId, apprenantId);
  
    // Create RTCSessionDescriptionInit object from the offerSignal
    const remoteDescription: RTCSessionDescriptionInit = {
      type: 'offer',
      sdp: offerSignal
    };
  
    // Set remote description and create answer
    this.peerConnection.setRemoteDescription(remoteDescription)
      .then(() => {
        this.peerConnection.createAnswer()
          .then(answer => {
            return this.peerConnection.setLocalDescription(answer);
          })
          .then(() => {
            const answerSignal = this.peerConnection.localDescription;
            // Send answer signal and IDs back to the formateur
            this.socketService.sendEvent('answer', { room: 'your_room_id', formateurId, apprenantId, answerSignal, accept: true });
          })
          .catch(error => {
            console.error('Error generating answer:', error);
          });
      })
      .catch(error => {
        console.error('Error setting remote description:', error);
      });
  }
  acceptCall(): void {
  this.dialogRef.close(true); // Signal that the call is accepted
}

declineCall(): void {
  this.dialogRef.close(false); // Signal that the call is declined
}

  acceptCalll(room: string): void {
    this.peerConnection.createAnswer()
      .then(answer => {
        return this.peerConnection.setLocalDescription(answer);
      })
      .then(() => {
        const answerSignal = this.peerConnection.localDescription;
        this.socketService.sendEvent('answer', { room, answerSignal, accept: true });
      })
      .catch(error => {
        console.error('Error generating answer:', error);
      });
  }

  rejectCalll(room: string): void {
    this.socketService.sendEvent('answer', { room, accept: false });
    // Handle UI for call rejection
  }
}
