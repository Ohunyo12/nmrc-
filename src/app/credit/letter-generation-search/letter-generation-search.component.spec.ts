import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterGenerationSearchComponent } from './letter-generation-search.component';

describe('LetterGenerationSearchComponent', () => {
  let component: LetterGenerationSearchComponent;
  let fixture: ComponentFixture<LetterGenerationSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterGenerationSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterGenerationSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
