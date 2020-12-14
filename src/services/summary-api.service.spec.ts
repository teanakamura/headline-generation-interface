import { TestBed } from '@angular/core/testing';

import { SummaryApiService } from './summary-api.service';

describe('SummaryApiService', () => {
  let service: SummaryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummaryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
