import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOfRiskAssetMainReportComponent } from './copy-of-risk-asset-main-report.component';

describe('CopyOfRiskAssetMainReportComponent', () => {
  let component: CopyOfRiskAssetMainReportComponent;
  let fixture: ComponentFixture<CopyOfRiskAssetMainReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyOfRiskAssetMainReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOfRiskAssetMainReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
