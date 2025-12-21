import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDutyConditionSetupComponent } from './stamp-duty-condition-setup.component';

describe('StampDutyConditionSetupComponent', () => {
  let component: StampDutyConditionSetupComponent;
  let fixture: ComponentFixture<StampDutyConditionSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampDutyConditionSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampDutyConditionSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
