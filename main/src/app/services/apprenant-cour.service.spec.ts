import { TestBed } from '@angular/core/testing';

import { ApprenantCourService } from './apprenant-cour.service';

describe('ApprenantCourService', () => {
  let service: ApprenantCourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApprenantCourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
