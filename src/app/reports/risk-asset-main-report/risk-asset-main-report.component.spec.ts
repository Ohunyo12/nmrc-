import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetMainReportComponent } from './risk-asset-main-report.component';

describe('RiskAssetMainReportComponent', () => {
  let component: RiskAssetMainReportComponent;
  let fixture: ComponentFixture<RiskAssetMainReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetMainReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetMainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
