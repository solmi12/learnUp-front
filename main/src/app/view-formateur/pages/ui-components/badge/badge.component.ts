import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-badge-formateur',
  templateUrl: './badge.component.html'
})
export class AppBadgeFormateurComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  hidden = false;

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

}
