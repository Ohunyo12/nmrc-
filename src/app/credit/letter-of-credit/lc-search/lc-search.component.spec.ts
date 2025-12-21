import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcSearchComponent } from './lc-search.component';

describe('LcSearchComponent', () => {
  let component: LcSearchComponent;
  let fixture: ComponentFixture<LcSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
