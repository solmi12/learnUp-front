import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFormateurCoursComponent } from './list-formateur-cours.component';

describe('ListFormateurCoursComponent', () => {
  let component: ListFormateurCoursComponent;
  let fixture: ComponentFixture<ListFormateurCoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListFormateurCoursComponent]
    });
    fixture = TestBed.createComponent(ListFormateurCoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
