import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Chapitre } from 'src/app/models/Chapitre';
import { Cour } from 'src/app/models/cour.model';
import { ChapitreService } from 'src/app/services/chapitre.service';
import { CourService } from 'src/app/services/cour.service';
import { DomSanitizer, type SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-cour-details',
  templateUrl: './cour-details.component.html',
  styleUrls: ['./cour-details.component.scss']
})
export class CourDetailsComponent implements OnInit {
  courId: number = 0; 
  cour:Cour | null = null;
  chapitres: Chapitre[] = [];
  showAddChapitreFormFlag: boolean = false;
  chapitre={
    chapitreId:null,
    titre:'',
    description:'',
    dureeEstimee:0,
    progressionComplete:false,
    ordreDansLeCours:0,
    pdfAttachment:'',
    imageData:'',
    courId:0,
    youtubeVideoLink:''
  }
  loading: boolean = false; 

  constructor(
    @Inject(ActivatedRoute) private route: ActivatedRoute,
    @Inject(CourService) private courService: CourService,
    @Inject(ChapitreService) private chapitreService: ChapitreService,
    @Inject(FormBuilder) private formBuilder: FormBuilder,
   @Inject(DomSanitizer) private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {// Initialize the form in ngOnInit
    this.route.params.subscribe(params => {
      this.courId = params['id']; // Get courId from route parameters
      if (this.courId) {
        this.loading = true; 
        this.getCourDetails(this.courId);
        this.getChapitres(this.courId);
      }
    });
    this.getChapitres(this.courId);
  }

  sanitizePdf(pdfData: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(`data:application/pdf;base64,${pdfData}`);
  }


  getCourDetails(courId: number): void {
    this.courService.getByCourId(courId).pipe(
      switchMap((data: Cour) => {
        console.log('Response Object:', data);
        this.loading = false; // Set loading to false after data is fetched
        this.cour = data;
        return of(data);
      })
    ).subscribe();
  }
  getChapitres(courId: number): void {
    this.chapitreService.getChapitresByCourId(courId).subscribe(
      (data: Chapitre[]) => {
        this.chapitres = data; // Assign array of Chapitre objects to chapitres property
      },
      (error) => {
        console.error('Error fetching chapitres:', error);
      }
    );
  }

  showAddChapitreForm(): void {
    this.showAddChapitreFormFlag = true;
  }
  addChapitre(): void {
    const formData = { ...this.chapitre }; // Copy the chapitre object
    // Handle file upload for pdfAttachment
    if (formData.pdfAttachment && formData.pdfAttachment.startsWith('data:application/pdf;base64,')) {
      formData.pdfAttachment = formData.pdfAttachment.replace(/^data:application\/pdf;base64,/, ''); // Remove the prefix
    }
    
    // Handle file upload for imageData (image)
    if (formData.imageData && formData.imageData.startsWith('data:image/')) {
      formData.imageData = formData.imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, ''); // Example for image data
    }
  
    formData.courId = this.courId;
    // Assuming you have a method to add chapitre
    this.chapitreService.addChapitre(formData).subscribe(
      (addedChapitre) => {
        console.log('Chapitre added successfully:', addedChapitre);
        // Refresh chapitres after adding
        if (this.courId) {
          this.getChapitres(this.courId);
        }
        this.clearChapitreForm();
      },
      (error) => {
        console.error('Error adding chapitre:', error);
        // Handle error
      }
    );
  }
  
  

  clearChapitreForm(): void {
    this.chapitre.titre='',
    this.chapitre.description='',
    this.chapitre.dureeEstimee=0,
    this.chapitre.ordreDansLeCours=0,
    this.chapitre.pdfAttachment='',
    this.chapitre.imageData='',
    
    this.chapitre.youtubeVideoLink=''
  }

  onFileChange(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Set the imageData with the base64 encoded image data
        this.chapitre.imageData = reader.result as string;
      };
    }
  }
  onFileChangePdf(event: any): void {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Set the imageData with the base64 encoded image data
        this.chapitre.pdfAttachment = reader.result as string;
      };
    }
  }
}
