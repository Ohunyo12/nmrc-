import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeferredLoanFeeComponent } from './deferred-loan-fee.component';

describe('DeferredLoanFeeComponent', () => {
  let component: DeferredLoanFeeComponent;
  let fixture: ComponentFixture<DeferredLoanFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeferredLoanFeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeferredLoanFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
