import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcEnhancementComponent } from './lc-enhancement.component';

describe('LcEnhancementComponent', () => {
  let component: LcEnhancementComponent;
  let fixture: ComponentFixture<LcEnhancementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcEnhancementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcEnhancementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
