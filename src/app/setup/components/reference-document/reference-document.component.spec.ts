import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceDocumentComponent } from './reference-document.component';

describe('ReferenceDocumentComponent', () => {
  let component: ReferenceDocumentComponent;
  let fixture: ComponentFixture<ReferenceDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferenceDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
