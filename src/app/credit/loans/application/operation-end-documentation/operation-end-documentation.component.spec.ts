import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperationEndDocumentationComponent } from './operation-end-documentation.component';

describe('OperationEndDocumentationComponent', () => {
  let component: OperationEndDocumentationComponent;
  let fixture: ComponentFixture<OperationEndDocumentationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperationEndDocumentationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperationEndDocumentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
