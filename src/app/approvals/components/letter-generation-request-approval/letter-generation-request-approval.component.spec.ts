import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterGenerationRequestApprovalComponent } from './letter-generation-request-approval.component';

describe('LetterGenerationRequestApprovalComponent', () => {
  let component: LetterGenerationRequestApprovalComponent;
  let fixture: ComponentFixture<LetterGenerationRequestApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterGenerationRequestApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterGenerationRequestApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
