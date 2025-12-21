import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcUssanceExtensionApprovalComponent } from './lc-ussance-extension-approval.component';

describe('LcUssanceExtensionApprovalComponent', () => {
  let component: LcUssanceExtensionApprovalComponent;
  let fixture: ComponentFixture<LcUssanceExtensionApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcUssanceExtensionApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcUssanceExtensionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
