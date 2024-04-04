import { Component, OnInit } from '@angular/core';
import { Cour } from 'src/app/models/cour.model';
import { CourService } from 'src/app/services/cour.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class AppMenuComponent implements OnInit {
  pendingCourses: Cour[] = [];

  constructor(private courService: CourService) {}

  ngOnInit(): void {
    this.fetchPendingCourses();
  }

  fetchPendingCourses() {
    this.courService.getPendingCourses().subscribe(
      (data: Cour[]) => {
        this.pendingCourses = data;
      },
      (error) => {
        console.error('Error fetching pending courses:', error);
      }
    );
  }

  acceptCourse(courId: number) {
    this.courService.acceptCour(courId).subscribe(
      (data: Cour) => {
        console.log('Course accepted:', data);
        // Refresh the list of pending courses after accepting
        this.fetchPendingCourses();
      },
      (error) => {
        console.error('Error accepting course:', error);
      }
    );
  }

  refuseCourse(courId: number) {
    this.courService.refuseCour(courId).subscribe(
      (data: Cour) => {
        console.log('Course refused:', data);
        // Refresh the list of pending courses after refusing
        this.fetchPendingCourses();
      },
      (error) => {
        console.error('Error refusing course:', error);
      }
    );
  }
}
