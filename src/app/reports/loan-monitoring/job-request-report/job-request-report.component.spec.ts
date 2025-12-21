import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobRequestReportComponent } from './job-request-report.component';

describe('JobRequestReportComponent', () => {
  let component: JobRequestReportComponent;
  let fixture: ComponentFixture<JobRequestReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobRequestReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
