import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanRefinancing2Component } from './loan-refinancing2.component';

describe('LoanRefinancing2Component', () => {
  let component: LoanRefinancing2Component;
  let fixture: ComponentFixture<LoanRefinancing2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanRefinancing2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanRefinancing2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
