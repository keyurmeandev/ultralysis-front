import { TestBed, inject } from '@angular/core/testing';

import { SendRequestService } from './send-request.service';

describe('SendRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SendRequestService]
    });
  });

  it('should be created', inject([SendRequestService], (service: SendRequestService) => {
    expect(service).toBeTruthy();
  }));
});
