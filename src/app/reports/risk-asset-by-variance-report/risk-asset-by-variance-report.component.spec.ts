import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetByVarianceReportComponent } from './risk-asset-by-variance-report.component';

describe('RiskAssetByVarianceReportComponent', () => {
  let component: RiskAssetByVarianceReportComponent;
  let fixture: ComponentFixture<RiskAssetByVarianceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetByVarianceReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetByVarianceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
