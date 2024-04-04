import { Component, Inject, OnInit } from '@angular/core'; // Update with the correct path
import type { Formateur } from 'src/app/models/formateur';
import { FormateurService } from 'src/app/services/formateur.service';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class AppChipsComponent implements OnInit {
  formateurs: Formateur[] = [];
  displayedColumns: string[] = ['email', 'role', 'fullName', 'expertise', 'experience', 'delete'];
  constructor(@Inject(FormateurService) private formateurService: FormateurService) {}

  ngOnInit(): void {
    this.getAllFormateurs();
  }

  getAllFormateurs(): void {
    this.formateurService.getAllFormateurs().subscribe(
      (data: Formateur[]) => {
        this.formateurs = data;
        console.log('Formateurs:', this.formateurs);
      },
      (error) => {
        console.error('Error fetching formateurs:', error);
      }
    );
  }

  deleteFormateur(formateurId: number) {
    this.formateurService.deleteFormateur(formateurId).subscribe(
      () => {
        // Remove the deleted apprenant from the list
        this.formateurs = this.formateurs.filter(formateur => formateur.formateurId !== formateurId);
        console.log('Formateur deleted successfully.');
      },
      (error) => {
        console.error('Error deleting apprenant:', error);
      }
    );
  }
}
