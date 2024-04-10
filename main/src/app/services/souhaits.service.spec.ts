import { TestBed } from '@angular/core/testing';

import { SouhaitsService } from './souhaits.service';

describe('SouhaitsService', () => {
  let service: SouhaitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SouhaitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
