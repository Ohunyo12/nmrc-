import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LmsCrmsUpdateComponent } from './lms-crms-update.component';

describe('LmsCrmsUpdateComponent', () => {
  let component: LmsCrmsUpdateComponent;
  let fixture: ComponentFixture<LmsCrmsUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LmsCrmsUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LmsCrmsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
