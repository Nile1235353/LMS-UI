import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcoursesComponent } from './viewcourses.component';

describe('ViewcoursesComponent', () => {
  let component: ViewcoursesComponent;
  let fixture: ComponentFixture<ViewcoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewcoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewcoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
