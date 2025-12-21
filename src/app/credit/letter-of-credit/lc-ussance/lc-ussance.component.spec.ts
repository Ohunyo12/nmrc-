import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcUssanceComponent } from './lc-ussance.component';

describe('LcUssanceComponent', () => {
  let component: LcUssanceComponent;
  let fixture: ComponentFixture<LcUssanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcUssanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcUssanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
