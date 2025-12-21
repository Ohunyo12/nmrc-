import { TestBed, inject } from '@angular/core/testing';

import { LetterGenerationRequestService } from './letter-generation-request.service';

describe('LetterGenerationRequestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LetterGenerationRequestService]
    });
  });

  it('should be created', inject([LetterGenerationRequestService], (service: LetterGenerationRequestService) => {
    expect(service).toBeTruthy();
  }));
});
