import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpiredFacilityReportComponent } from './expired-facility-report.component';

describe('ExpiredFacilityReportComponent', () => {
  let component: ExpiredFacilityReportComponent;
  let fixture: ComponentFixture<ExpiredFacilityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpiredFacilityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpiredFacilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
