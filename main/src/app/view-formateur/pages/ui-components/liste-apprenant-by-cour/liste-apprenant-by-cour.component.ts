import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Apprenant } from 'src/app/models/Apprenant';
import { Cour } from 'src/app/models/cour.model';
import { ApprenantCourService } from 'src/app/services/apprenant-cour.service';
import { CourService } from 'src/app/services/cour.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-liste-apprenant-by-cour',
  templateUrl: './liste-apprenant-by-cour.component.html',
  styleUrls: ['./liste-apprenant-by-cour.component.scss']
})
export class ListeApprenantByCourComponent implements OnInit {
  formateurId: number = 0;
  cours: Cour[] = [];
  apprenantsMap: Map<number, Apprenant[]> = new Map<number, Apprenant[]>();

  constructor(
    private courService: CourService,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private apprenantCourService: ApprenantCourService
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('userId');
    const userId = parseInt(storedId || '', 10);
    if (!isNaN(userId)) {
      this.getUserDetails(userId);
    } else {
      console.error('Invalid user ID stored in localStorage');
    }
  }

  getUserDetails(userId: number): void {
    this.userService.getUserById(userId).pipe(
      switchMap((data: any) => {
        this.formateurId = data.formateurId;
        return this.getCoursByFormateurId(this.formateurId);
      })
    ).subscribe((cours: Cour[]) => {
      this.cours = cours;
      this.getCoursApprenants();
    });
  }

  getCoursByFormateurId(formateurId: number): Observable<Cour[]> {
    return this.courService.getCoursByFormateurId(formateurId);
  }

  getCoursApprenants(): void {
    this.cours.forEach(cour => {
      this.getApprenantsByCourId(cour.courId!).subscribe((apprenants: Apprenant[]) => {
        this.apprenantsMap.set(cour.courId!, apprenants);
      });
    });
  }

  getApprenantsByCourId(courId: number): Observable<Apprenant[]> {
    return this.apprenantCourService.getApprenantsByCourId(courId);
  }
}
