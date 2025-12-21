import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalStampSetupComponent } from './digital-stamp-setup.component';

describe('DigitalStampSetupComponent', () => {
  let component: DigitalStampSetupComponent;
  let fixture: ComponentFixture<DigitalStampSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalStampSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalStampSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
