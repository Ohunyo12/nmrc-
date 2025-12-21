import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IblChecklistSetupComponent } from './ibl-checklist-setup.component';

describe('IblChecklistSetupComponent', () => {
  let component: IblChecklistSetupComponent;
  let fixture: ComponentFixture<IblChecklistSetupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IblChecklistSetupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IblChecklistSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
