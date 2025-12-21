import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcUssanceApprovalComponent } from './lc-ussance-approval.component';

describe('LcUssanceApprovalComponent', () => {
  let component: LcUssanceApprovalComponent;
  let fixture: ComponentFixture<LcUssanceApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcUssanceApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcUssanceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
