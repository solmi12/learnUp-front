import { Component, Input, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Apprenant } from 'src/app/models/Apprenant';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
})
export class AppListsComponent implements OnInit {
  @Input() apprenants: Apprenant[] = [];
  displayedColumns: string[] = ['email', 'role', 'fullName', 'educationLevel', 'interests', 'delete'];
  classe: string = '';
  apprenantsByClasse: { [key: string]: Apprenant[] } = {}; // Object to store apprenants by classe
  Object = Object;
  toggle: boolean = true; // Set toggle to false initially

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getAllApprenants();
  }

  getAllApprenants() {
    this.studentService.getAllStudents().subscribe(
      (data: Apprenant[]) => {
        this.apprenants = data;
        console.log('Apprenants:', this.apprenants);
        this.groupApprenantsByClasse(); // Call the grouping function after fetching apprenants
      },
      (error) => {
        console.error('Error fetching apprenants:', error);
      }
    );
  }

  toggleApprenantsByClasse(): void {
    this.toggle = !this.toggle; // Toggle the value
  }

  groupApprenantsByClasse(): void {
    this.apprenantsByClasse = {}; // Clear the object before regrouping
    this.apprenants.forEach(apprenant => {
      const classe = apprenant.classe || 'All Apprenants'; // Use 'No Classe' for apprenants without a classe
      if (!this.apprenantsByClasse[classe]) {
        this.apprenantsByClasse[classe] = [];
      }
      this.apprenantsByClasse[classe].push(apprenant);
    });
  }

  deleteApprenant(apprenantId: number) {
    this.studentService.deleteStudentById(apprenantId).subscribe(
      () => {
        // Remove the deleted apprenant from the list
        this.apprenants = this.apprenants.filter(apprenant => apprenant.apprenantId !== apprenantId);
        this.groupApprenantsByClasse(); // Regroup apprenants after deletion
        console.log('Apprenant deleted successfully.');
      },
      (error) => {
        console.error('Error deleting apprenant:', error);
      }
    );
  }
}
