import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcDocumentsComponent } from './lc-documents.component';

describe('LcDocumentsComponent', () => {
  let component: LcDocumentsComponent;
  let fixture: ComponentFixture<LcDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
