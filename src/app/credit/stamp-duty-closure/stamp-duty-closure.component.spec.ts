import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StampDutyClosureComponent } from './stamp-duty-closure.component';

describe('StampDutyClosureComponent', () => {
  let component: StampDutyClosureComponent;
  let fixture: ComponentFixture<StampDutyClosureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StampDutyClosureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StampDutyClosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
