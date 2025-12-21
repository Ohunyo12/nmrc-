import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFacilityApprovalComponent } from './modify-facility-approval.component';

describe('ModifyFacilityApprovalComponent', () => {
  let component: ModifyFacilityApprovalComponent;
  let fixture: ComponentFixture<ModifyFacilityApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyFacilityApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyFacilityApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
