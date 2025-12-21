import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcCancelationComponent } from './lc-cancelation.component';

describe('LcCancelationComponent', () => {
  let component: LcCancelationComponent;
  let fixture: ComponentFixture<LcCancelationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcCancelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcCancelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
