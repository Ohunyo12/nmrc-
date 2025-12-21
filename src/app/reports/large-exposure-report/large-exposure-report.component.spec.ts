import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeExposureReportComponent } from './large-exposure-report.component';

describe('LargeExposureReportComponent', () => {
  let component: LargeExposureReportComponent;
  let fixture: ComponentFixture<LargeExposureReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LargeExposureReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LargeExposureReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
