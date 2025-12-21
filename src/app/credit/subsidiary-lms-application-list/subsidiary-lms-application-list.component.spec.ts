import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiaryLmsApplicationListComponent } from './subsidiary-lms-application-list.component';

describe('SubsidiaryLmsApplicationListComponent', () => {
  let component: SubsidiaryLmsApplicationListComponent;
  let fixture: ComponentFixture<SubsidiaryLmsApplicationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubsidiaryLmsApplicationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubsidiaryLmsApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
