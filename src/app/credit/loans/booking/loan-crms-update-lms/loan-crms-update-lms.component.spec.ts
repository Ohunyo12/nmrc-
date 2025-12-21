import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanCrmsUpdateLmsComponent } from './loan-crms-update-lms.component';

describe('LoanCrmsUpdateLmsComponent', () => {
  let component: LoanCrmsUpdateLmsComponent;
  let fixture: ComponentFixture<LoanCrmsUpdateLmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanCrmsUpdateLmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanCrmsUpdateLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
