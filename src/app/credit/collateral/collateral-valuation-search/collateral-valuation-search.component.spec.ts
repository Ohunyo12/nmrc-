import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollateralValuationSearchComponent } from './collateral-valuation-search.component';

describe('CollateralValuationSearchComponent', () => {
  let component: CollateralValuationSearchComponent;
  let fixture: ComponentFixture<CollateralValuationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralValuationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralValuationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
