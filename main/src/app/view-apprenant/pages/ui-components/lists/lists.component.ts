import { Component, Inject, Input, OnInit } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { Apprenant } from 'src/app/models/Apprenant';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
})
export class AppListsComponent implements OnInit {
  @Input() apprenants: Apprenant[] = [];
  displayedColumns: string[] = ['email', 'role', 'fullName', 'educationLevel', 'interests', 'delete'];


  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.getAllApprenants();
  }

  getAllApprenants() {
    this.studentService.getAllStudents().subscribe(
      (data: Apprenant[]) => {
        this.apprenants = data;
        console.log('Apprenants:', this.apprenants);
      },
      (error) => {
        console.error('Error fetching apprenants:', error);
      }
    );
  }
  deleteApprenant(id: number) {
    this.studentService.deleteStudentById(id).subscribe(
      () => {
        // Remove the deleted apprenant from the list
        this.apprenants = this.apprenants.filter(apprenant => apprenant.apprenantId !== id);
        console.log('Apprenant deleted successfully.');
      },
      (error) => {
        console.error('Error deleting apprenant:', error);
      }
    );
  }
}
