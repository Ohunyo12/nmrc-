import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralSwapSearchComponent } from './collateral-swap-search.component';

describe('CollateralSwapSearchComponent', () => {
  let component: CollateralSwapSearchComponent;
  let fixture: ComponentFixture<CollateralSwapSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralSwapSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralSwapSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
