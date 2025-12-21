import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowChangeComponent } from './workflow-change.component';



describe('WorkflowChangeComponent', () => {
  let component: WorkflowChangeComponent;
  let fixture: ComponentFixture<WorkflowChangeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowChangeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
