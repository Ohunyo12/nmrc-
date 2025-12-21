import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcExtensionComponent } from './lc-extension.component';

describe('LcExtensionComponent', () => {
  let component: LcExtensionComponent;
  let fixture: ComponentFixture<LcExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
