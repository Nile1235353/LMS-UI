import { TestBed } from '@angular/core/testing';
import { ViewcoursesService } from './viewcourses.service';

describe('ViewcoursesService', () => {
  let service: ViewcoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewcoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
