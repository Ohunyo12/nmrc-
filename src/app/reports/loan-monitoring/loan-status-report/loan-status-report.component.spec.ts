import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanStatusReportComponent } from './loan-status-report.component';

describe('LoanStatusReportComponent', () => {
  let component: LoanStatusReportComponent;
  let fixture: ComponentFixture<LoanStatusReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanStatusReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanStatusReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
