import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideSpendingResultsComponent } from './outside-spending-results.component';

describe('OutsideSpendingResultsComponent', () => {
  let component: OutsideSpendingResultsComponent;
  let fixture: ComponentFixture<OutsideSpendingResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutsideSpendingResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideSpendingResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
