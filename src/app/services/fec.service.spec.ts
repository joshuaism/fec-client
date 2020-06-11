import { TestBed } from '@angular/core/testing';

import { FecService } from './fec.service';

describe('FecService', () => {
  let service: FecService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FecService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
