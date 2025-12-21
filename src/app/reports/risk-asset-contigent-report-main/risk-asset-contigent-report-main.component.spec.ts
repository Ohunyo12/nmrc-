import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetContigentReportMainComponent } from './risk-asset-contigent-report-main.component';

describe('RiskAssetContigentReportMainComponent', () => {
  let component: RiskAssetContigentReportMainComponent;
  let fixture: ComponentFixture<RiskAssetContigentReportMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetContigentReportMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetContigentReportMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
