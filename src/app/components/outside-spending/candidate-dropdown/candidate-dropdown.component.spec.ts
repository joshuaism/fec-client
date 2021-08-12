import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDropdownComponent } from './candidate-dropdown.component';

describe('CandidateDropdownComponent', () => {
  let component: CandidateDropdownComponent;
  let fixture: ComponentFixture<CandidateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
