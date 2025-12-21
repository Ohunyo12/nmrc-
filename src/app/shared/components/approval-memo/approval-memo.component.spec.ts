import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalMemoComponent } from './approval-memo.component';

describe('ApprovalMemoComponent', () => {
  let component: ApprovalMemoComponent;
  let fixture: ComponentFixture<ApprovalMemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalMemoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalMemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
