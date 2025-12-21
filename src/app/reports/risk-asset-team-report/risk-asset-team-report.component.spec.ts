import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetTeamReportComponent } from './risk-asset-team-report.component';

describe('RiskAssetTeamReportComponent', () => {
  let component: RiskAssetTeamReportComponent;
  let fixture: ComponentFixture<RiskAssetTeamReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetTeamReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetTeamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
