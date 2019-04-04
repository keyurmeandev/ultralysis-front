import { TestBed, inject } from '@angular/core/testing';

import { InitializeProjectService } from './initialize-project.service';

describe('InitializeProjectService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitializeProjectService]
    });
  });

  it('should be created', inject([InitializeProjectService], (service: InitializeProjectService) => {
    expect(service).toBeTruthy();
  }));
});
