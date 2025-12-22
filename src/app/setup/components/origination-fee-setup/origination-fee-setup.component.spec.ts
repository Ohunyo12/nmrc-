import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OriginationFeeSetupComponent } from './origination-fee-setup.component';

describe('OriginationFeeSetupComponent', () => {
  let component: OriginationFeeSetupComponent;
  let fixture: ComponentFixture<OriginationFeeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OriginationFeeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OriginationFeeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
