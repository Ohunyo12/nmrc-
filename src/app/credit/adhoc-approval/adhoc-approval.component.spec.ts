import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhocApprovalComponent } from './adhoc-approval.component';

describe('AdhocApprovalComponent', () => {
  let component: AdhocApprovalComponent;
  let fixture: ComponentFixture<AdhocApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdhocApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdhocApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
