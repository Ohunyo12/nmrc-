import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterGenerationRequestComponent } from './letter-generation-request.component';

describe('LetterGenerationRequestComponent', () => {
  let component: LetterGenerationRequestComponent;
  let fixture: ComponentFixture<LetterGenerationRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterGenerationRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterGenerationRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
