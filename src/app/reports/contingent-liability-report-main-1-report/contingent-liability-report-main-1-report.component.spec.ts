import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContingentLiabilityReportMain1ReportComponent } from './contingent-liability-report-main-1-report.component';

describe('ContingentLiabilityReportMain1ReportComponent', () => {
  let component: ContingentLiabilityReportMain1ReportComponent;
  let fixture: ComponentFixture<ContingentLiabilityReportMain1ReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingentLiabilityReportMain1ReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingentLiabilityReportMain1ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
