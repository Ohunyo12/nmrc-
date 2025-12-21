import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedEmployerComponent } from './related-employer.component';

describe('RelatedEmployerComponent', () => {
  let component: RelatedEmployerComponent;
  let fixture: ComponentFixture<RelatedEmployerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelatedEmployerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedEmployerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
