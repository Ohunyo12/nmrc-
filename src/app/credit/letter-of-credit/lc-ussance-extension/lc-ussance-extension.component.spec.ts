import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcUssanceExtensionComponent } from './lc-ussance-extension.component';

describe('LcUssanceExtensionComponent', () => {
  let component: LcUssanceExtensionComponent;
  let fixture: ComponentFixture<LcUssanceExtensionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcUssanceExtensionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcUssanceExtensionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
