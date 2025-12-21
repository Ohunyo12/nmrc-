import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IfrsclassificationTeamComponent } from './ifrsclassification-team.component';

describe('IfrsclassificationTeamComponent', () => {
  let component: IfrsclassificationTeamComponent;
  let fixture: ComponentFixture<IfrsclassificationTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IfrsclassificationTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IfrsclassificationTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
