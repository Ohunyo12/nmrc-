import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseOfShippingDocumentsComponent } from './release-of-shipping-documents.component';

describe('ReleaseOfShippingDocumentsComponent', () => {
  let component: ReleaseOfShippingDocumentsComponent;
  let fixture: ComponentFixture<ReleaseOfShippingDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReleaseOfShippingDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReleaseOfShippingDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
