import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcExtensionApprovalComponent } from './lc-extension-approval.component';

describe('LcExtensionApprovalComponent', () => {
  let component: LcExtensionApprovalComponent;
  let fixture: ComponentFixture<LcExtensionApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcExtensionApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcExtensionApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
