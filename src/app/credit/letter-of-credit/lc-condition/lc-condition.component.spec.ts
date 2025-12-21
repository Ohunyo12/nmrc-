import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcConditionComponent } from './lc-condition.component';

describe('LcConditionComponent', () => {
  let component: LcConditionComponent;
  let fixture: ComponentFixture<LcConditionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcConditionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcConditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
