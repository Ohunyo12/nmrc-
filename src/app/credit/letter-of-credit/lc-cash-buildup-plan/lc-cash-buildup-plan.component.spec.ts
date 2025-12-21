import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcCashBuildupPlanComponent } from './lc-cash-buildup-plan.component';

describe('LcCashBuildupPlanComponent', () => {
  let component: LcCashBuildupPlanComponent;
  let fixture: ComponentFixture<LcCashBuildupPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcCashBuildupPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcCashBuildupPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
