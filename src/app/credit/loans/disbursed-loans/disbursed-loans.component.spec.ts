import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisbursedLoansComponent } from './disbursed-loans.component';

describe('DisbursedLoansComponent', () => {
  let component: DisbursedLoansComponent;
  let fixture: ComponentFixture<DisbursedLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisbursedLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisbursedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
