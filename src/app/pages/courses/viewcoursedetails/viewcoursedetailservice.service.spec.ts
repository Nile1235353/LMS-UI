import { TestBed } from '@angular/core/testing';

import { ViewcoursedetailserviceService } from './viewcoursedetailservice.service';

describe('ViewcoursedetailserviceService', () => {
  let service: ViewcoursedetailserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ViewcoursedetailserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
