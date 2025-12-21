import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetByCbnNplClassificationReportComponent } from './risk-asset-by-cbn-npl-classification-report.component';

describe('RiskAssetByCbnNplClassificationReportComponent', () => {
  let component: RiskAssetByCbnNplClassificationReportComponent;
  let fixture: ComponentFixture<RiskAssetByCbnNplClassificationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetByCbnNplClassificationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetByCbnNplClassificationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
