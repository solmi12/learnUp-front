import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesApprentissagesComponent } from './mes-apprentissages.component';

describe('MesApprentissagesComponent', () => {
  let component: MesApprentissagesComponent;
  let fixture: ComponentFixture<MesApprentissagesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesApprentissagesComponent]
    });
    fixture = TestBed.createComponent(MesApprentissagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
