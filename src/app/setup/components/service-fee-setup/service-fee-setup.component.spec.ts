import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFeeSetupComponent } from './service-fee-setup.component';

describe('ServiceFeeSetupComponent', () => {
  let component: ServiceFeeSetupComponent;
  let fixture: ComponentFixture<ServiceFeeSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceFeeSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceFeeSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
