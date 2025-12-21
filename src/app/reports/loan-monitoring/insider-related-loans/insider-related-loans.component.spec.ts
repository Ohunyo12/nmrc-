import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsiderRelatedLoansComponent } from './insider-related-loans.component';

describe('InsiderRelatedLoansComponent', () => {
  let component: InsiderRelatedLoansComponent;
  let fixture: ComponentFixture<InsiderRelatedLoansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsiderRelatedLoansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsiderRelatedLoansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
