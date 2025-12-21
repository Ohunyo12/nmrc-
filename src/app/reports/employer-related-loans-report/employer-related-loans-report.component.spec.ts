import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployerRelatedLoansReportComponent } from './employer-related-loans-report.component';

describe('EmployerRelatedLoansReportComponent', () => {
  let component: EmployerRelatedLoansReportComponent;
  let fixture: ComponentFixture<EmployerRelatedLoansReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployerRelatedLoansReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployerRelatedLoansReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
