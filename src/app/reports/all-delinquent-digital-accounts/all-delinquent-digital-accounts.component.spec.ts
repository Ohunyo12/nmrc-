import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDelinquentDigitalAccountsComponent } from './all-delinquent-digital-accounts.component';

describe('AllDelinquentDigitalAccountsComponent', () => {
  let component: AllDelinquentDigitalAccountsComponent;
  let fixture: ComponentFixture<AllDelinquentDigitalAccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDelinquentDigitalAccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDelinquentDigitalAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
