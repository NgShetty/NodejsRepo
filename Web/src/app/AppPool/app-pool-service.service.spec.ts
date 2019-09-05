import { TestBed } from '@angular/core/testing';

import { AppPoolServiceService } from './app-pool-service.service';

describe('AppPoolServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppPoolServiceService = TestBed.get(AppPoolServiceService);
    expect(service).toBeTruthy();
  });
});
