import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetByIfrsClassificationComponent } from './risk-asset-by-ifrs-classification.component';

describe('RiskAssetByIfrsClassificationComponent', () => {
  let component: RiskAssetByIfrsClassificationComponent;
  let fixture: ComponentFixture<RiskAssetByIfrsClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetByIfrsClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetByIfrsClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
