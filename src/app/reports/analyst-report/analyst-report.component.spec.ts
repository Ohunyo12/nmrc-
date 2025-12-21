import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalystReportComponent } from './analyst-report.component';

describe('AnalystReportComponent', () => {
  let component: AnalystReportComponent;
  let fixture: ComponentFixture<AnalystReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalystReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalystReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
