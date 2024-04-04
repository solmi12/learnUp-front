import { Component, Inject, OnInit } from '@angular/core';
import type { Chapitre } from 'src/app/models/Chapitre';
import type { Cour } from 'src/app/models/cour.model';
import { CourService } from 'src/app/services/cour.service';

@Component({
  selector: 'app-tooltips',
  templateUrl: './tooltips.component.html',
  styleUrls: ['./tooltips.component.scss'],
})
export class AppTooltipsComponent implements OnInit {
  cours: Cour[] = [];

  
  constructor(@Inject(CourService) private courService: CourService) {}

  ngOnInit(): void {
    this.getAllCours();
  }

  getAllCours(): void {
    this.courService.getAllCours().subscribe(
      (data: Cour[]) => {
        this.cours = data; // Assign the fetched courses to the cours array
      },
      (error) => {
        console.error('Error fetching cours:', error);
      }
    );
  }
}
