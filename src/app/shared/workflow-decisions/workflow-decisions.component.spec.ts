import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDecisionsComponent } from './workflow-decisions.component';

describe('WorkflowDecisionsComponent', () => {
  let component: WorkflowDecisionsComponent;
  let fixture: ComponentFixture<WorkflowDecisionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDecisionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
