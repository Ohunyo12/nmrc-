import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyFacilityComponent } from './modify-facility.component';

describe('ModifyFacilityComponent', () => {
  let component: ModifyFacilityComponent;
  let fixture: ComponentFixture<ModifyFacilityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyFacilityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyFacilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
