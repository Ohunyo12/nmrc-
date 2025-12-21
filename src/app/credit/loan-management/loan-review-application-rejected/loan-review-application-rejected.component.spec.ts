import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanReviewApplicationRejectedComponent } from './loan-review-application-rejected.component';

describe('LoanReviewApplicationRejectedComponent', () => {
  let component: LoanReviewApplicationRejectedComponent;
  let fixture: ComponentFixture<LoanReviewApplicationRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanReviewApplicationRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanReviewApplicationRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
