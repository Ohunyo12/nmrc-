import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyOfRiskAssetByIfrsClassificationComponent } from './copy-of-risk-asset-by-ifrs-classification.component';

describe('CopyOfRiskAssetByIfrsClassificationComponent', () => {
  let component: CopyOfRiskAssetByIfrsClassificationComponent;
  let fixture: ComponentFixture<CopyOfRiskAssetByIfrsClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyOfRiskAssetByIfrsClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyOfRiskAssetByIfrsClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
