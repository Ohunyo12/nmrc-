import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DrawDownApplicationStatusComponent } from './draw-down-application-status.component';

describe('DrawDownApplicationStatusComponent', () => {
  let component: DrawDownApplicationStatusComponent;
  let fixture: ComponentFixture<DrawDownApplicationStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawDownApplicationStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawDownApplicationStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
