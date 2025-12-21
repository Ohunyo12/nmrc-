import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReassignRequestComponent } from './reassign-request.component';

describe('ReassignRequestComponent', () => {
  let component: ReassignRequestComponent;
  let fixture: ComponentFixture<ReassignRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReassignRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReassignRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
