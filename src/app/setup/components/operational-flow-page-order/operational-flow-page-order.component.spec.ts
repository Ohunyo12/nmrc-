import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationalFlowPageOrderComponent } from './operational-flow-page-order.component';

describe('OperationalFlowPageOrderComponent', () => {
  let component: OperationalFlowPageOrderComponent;
  let fixture: ComponentFixture<OperationalFlowPageOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationalFlowPageOrderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationalFlowPageOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
