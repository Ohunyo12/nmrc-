import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityReportComponent } from './maturity-report.component';

describe('MaturityReportComponent', () => {
  let component: MaturityReportComponent;
  let fixture: ComponentFixture<MaturityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaturityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
