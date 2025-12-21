import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDelinquentAccountsComponent } from './all-delinquent-accounts.component';

describe('AllDelinquentAccountsComponent', () => {
  let component: AllDelinquentAccountsComponent;
  let fixture: ComponentFixture<AllDelinquentAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDelinquentAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDelinquentAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
