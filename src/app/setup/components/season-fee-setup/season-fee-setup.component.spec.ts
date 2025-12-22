import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonFeeSetupComponent } from './season-fee-setup.component';

describe('SeasonFeeSetupComponent', () => {
  let component: SeasonFeeSetupComponent;
  let fixture: ComponentFixture<SeasonFeeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeasonFeeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeasonFeeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
