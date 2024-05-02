// dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  messageTitle: string = '';
  messageContent: string = '';

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.setMessageContent();
  }

  setMessageContent(): void {
    const isSuccess: boolean = this.data.isSuccess; // Get the actual response status
    if (isSuccess) {
      this.messageTitle = 'Congratulations!';
      this.messageContent = 'Test successful!';
    } else {
      this.messageTitle = 'Sorry!';
      this.messageContent = 'You did not pass the test.';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
