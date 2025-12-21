import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcIssuanceCancelationApprovalComponent } from './lc-issuance-cancelation-approval.component';

describe('LcIssuanceCancelationApprovalComponent', () => {
  let component: LcIssuanceCancelationApprovalComponent;
  let fixture: ComponentFixture<LcIssuanceCancelationApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcIssuanceCancelationApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcIssuanceCancelationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
