import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseOfShippingDocumentsApprovalComponent } from './release-of-shipping-documents-approval.component';

describe('ReleaseOfShippingDocumentsApprovalComponent', () => {
  let component: ReleaseOfShippingDocumentsApprovalComponent;
  let fixture: ComponentFixture<ReleaseOfShippingDocumentsApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseOfShippingDocumentsApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseOfShippingDocumentsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
