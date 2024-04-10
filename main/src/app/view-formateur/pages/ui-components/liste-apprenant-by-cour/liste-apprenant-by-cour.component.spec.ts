import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeApprenantByCourComponent } from './liste-apprenant-by-cour.component';

describe('ListeApprenantByCourComponent', () => {
  let component: ListeApprenantByCourComponent;
  let fixture: ComponentFixture<ListeApprenantByCourComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeApprenantByCourComponent]
    });
    fixture = TestBed.createComponent(ListeApprenantByCourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
