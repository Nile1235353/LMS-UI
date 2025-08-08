import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcoursedetailsComponent } from './viewcoursedetails.component';

describe('ViewcoursedetailsComponent', () => {
  let component: ViewcoursedetailsComponent;
  let fixture: ComponentFixture<ViewcoursedetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewcoursedetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewcoursedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
