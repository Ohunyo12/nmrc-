import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetDistributionBySectorReportComponent } from './risk-asset-distribution-by-sector-report.component';

describe('RiskAssetDistributionBySectorReportComponent', () => {
  let component: RiskAssetDistributionBySectorReportComponent;
  let fixture: ComponentFixture<RiskAssetDistributionBySectorReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetDistributionBySectorReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetDistributionBySectorReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
