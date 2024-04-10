import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSouhaitComponent } from './list-souhait.component';

describe('ListSouhaitComponent', () => {
  let component: ListSouhaitComponent;
  let fixture: ComponentFixture<ListSouhaitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListSouhaitComponent]
    });
    fixture = TestBed.createComponent(ListSouhaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
