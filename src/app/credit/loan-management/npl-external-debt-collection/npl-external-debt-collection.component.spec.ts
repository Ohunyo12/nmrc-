import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NplExternalDebtCollectionComponent } from './npl-external-debt-collection.component';

describe('NplExternalDebtCollectionComponent', () => {
  let component: NplExternalDebtCollectionComponent;
  let fixture: ComponentFixture<NplExternalDebtCollectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NplExternalDebtCollectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NplExternalDebtCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
