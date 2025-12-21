import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumerProtectionComponent } from './consumer-protection.component';

describe('ConsumerProtectionComponent', () => {
  let component: ConsumerProtectionComponent;
  let fixture: ComponentFixture<ConsumerProtectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsumerProtectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsumerProtectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
