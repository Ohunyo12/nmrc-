import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContigentLiabilityReportMainReportComponent } from './contigent-liability-report-main-report.component';

describe('ContigentLiabilityReportMainReportComponent', () => {
  let component: ContigentLiabilityReportMainReportComponent;
  let fixture: ComponentFixture<ContigentLiabilityReportMainReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContigentLiabilityReportMainReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContigentLiabilityReportMainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
