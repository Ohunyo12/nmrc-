import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverlineReportComponent } from './overline-report.component';

describe('OverlineReportComponent', () => {
  let component: OverlineReportComponent;
  let fixture: ComponentFixture<OverlineReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverlineReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverlineReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
