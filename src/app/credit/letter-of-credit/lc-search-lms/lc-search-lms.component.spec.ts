import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcSearchLmsComponent } from './lc-search-lms.component';

describe('LcSearchLmsComponent', () => {
  let component: LcSearchLmsComponent;
  let fixture: ComponentFixture<LcSearchLmsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcSearchLmsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcSearchLmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
