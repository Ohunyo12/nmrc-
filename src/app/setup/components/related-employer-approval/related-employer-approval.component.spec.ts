import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEmployerApprovalComponent } from './related-employer-approval.component';

describe('RelatedEmployerApprovalComponent', () => {
  let component: RelatedEmployerApprovalComponent;
  let fixture: ComponentFixture<RelatedEmployerApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedEmployerApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedEmployerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
