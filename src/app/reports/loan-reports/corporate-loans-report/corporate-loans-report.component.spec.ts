import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporateLoansReportComponent } from './corporate-loans-report.component';

describe('CorporateLoansReportComponent', () => {
  let component: CorporateLoansReportComponent;
  let fixture: ComponentFixture<CorporateLoansReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorporateLoansReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorporateLoansReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
