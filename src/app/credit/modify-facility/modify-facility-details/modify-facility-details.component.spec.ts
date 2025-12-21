import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFacilityDetailsComponent } from './modify-facility-details.component';

describe('ModifyFacilityDetailsComponent', () => {
  let component: ModifyFacilityDetailsComponent;
  let fixture: ComponentFixture<ModifyFacilityDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyFacilityDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyFacilityDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
