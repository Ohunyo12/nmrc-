import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalMonitoringComponent } from './approval-monitoring.component';

describe('ApprovalMonitoringComponent', () => {
  let component: ApprovalMonitoringComponent;
  let fixture: ComponentFixture<ApprovalMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalMonitoringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
