import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbnNplTeamReportComponent } from './cbn-npl-team-report.component';

describe('CbnNplTeamReportComponent', () => {
  let component: CbnNplTeamReportComponent;
  let fixture: ComponentFixture<CbnNplTeamReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbnNplTeamReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbnNplTeamReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
