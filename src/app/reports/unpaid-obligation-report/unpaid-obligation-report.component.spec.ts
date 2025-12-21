import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpaidObligationReportComponent } from './unpaid-obligation-report.component';

describe('UnpaidObligationReportComponent', () => {
  let component: UnpaidObligationReportComponent;
  let fixture: ComponentFixture<UnpaidObligationReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpaidObligationReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpaidObligationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
