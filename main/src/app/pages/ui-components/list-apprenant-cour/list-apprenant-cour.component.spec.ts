import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListApprenantCourComponent } from './list-apprenant-cour.component';

describe('ListApprenantCourComponent', () => {
  let component: ListApprenantCourComponent;
  let fixture: ComponentFixture<ListApprenantCourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListApprenantCourComponent]
    });
    fixture = TestBed.createComponent(ListApprenantCourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
