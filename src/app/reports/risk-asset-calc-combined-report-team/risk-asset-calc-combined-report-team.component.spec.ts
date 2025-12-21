import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetCalcCombinedReportTeamComponent } from './risk-asset-calc-combined-report-team.component';

describe('RiskAssetCalcCombinedReportTeamComponent', () => {
  let component: RiskAssetCalcCombinedReportTeamComponent;
  let fixture: ComponentFixture<RiskAssetCalcCombinedReportTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetCalcCombinedReportTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetCalcCombinedReportTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
