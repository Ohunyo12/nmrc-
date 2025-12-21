import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedDepositCollateralComponent } from './fixed-deposit-collateral.component';

describe('FixedDepositCollateralComponent', () => {
  let component: FixedDepositCollateralComponent;
  let fixture: ComponentFixture<FixedDepositCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedDepositCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedDepositCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
