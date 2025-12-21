import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcEnhancementApprovalComponent } from './lc-enhancement-approval.component';

describe('LcEnhancementApprovalComponent', () => {
  let component: LcEnhancementApprovalComponent;
  let fixture: ComponentFixture<LcEnhancementApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcEnhancementApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcEnhancementApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
