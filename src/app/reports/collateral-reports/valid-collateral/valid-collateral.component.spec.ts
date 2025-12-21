import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidCollateralComponent } from './valid-collateral.component';

describe('ValidCollateralComponent', () => {
  let component: ValidCollateralComponent;
  let fixture: ComponentFixture<ValidCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
