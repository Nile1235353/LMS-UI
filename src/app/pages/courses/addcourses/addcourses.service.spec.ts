import { TestBed } from '@angular/core/testing';

import { AddcoursesService } from './addcourses.service';

describe('AddcoursesService', () => {
  let service: AddcoursesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddcoursesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
