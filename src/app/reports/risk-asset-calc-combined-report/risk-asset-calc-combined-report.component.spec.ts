import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetCalcCombinedReportComponent } from './risk-asset-calc-combined-report.component';

describe('RiskAssetCalcCombinedReportComponent', () => {
  let component: RiskAssetCalcCombinedReportComponent;
  let fixture: ComponentFixture<RiskAssetCalcCombinedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetCalcCombinedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetCalcCombinedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
