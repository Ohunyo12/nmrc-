import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskAssetMain1Component } from './risk-asset-main-1.component';

describe('RiskAssetMain1Component', () => {
  let component: RiskAssetMain1Component;
  let fixture: ComponentFixture<RiskAssetMain1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskAssetMain1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskAssetMain1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
