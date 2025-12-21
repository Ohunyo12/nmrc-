import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContigentLiabilityReportComponent } from './contigent-liability-report.component';

describe('ContigentLiabilityReportComponent', () => {
  let component: ContigentLiabilityReportComponent;
  let fixture: ComponentFixture<ContigentLiabilityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContigentLiabilityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContigentLiabilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
