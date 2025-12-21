import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcShippingComponent } from './lc-shipping.component';

describe('LcShippingComponent', () => {
  let component: LcShippingComponent;
  let fixture: ComponentFixture<LcShippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcShippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
