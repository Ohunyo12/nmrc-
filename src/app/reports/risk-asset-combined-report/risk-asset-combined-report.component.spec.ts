import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetCombinedReportComponent } from './risk-asset-combined-report.component';

describe('RiskAssetCombinedReportComponent', () => {
  let component: RiskAssetCombinedReportComponent;
  let fixture: ComponentFixture<RiskAssetCombinedReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetCombinedReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetCombinedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
