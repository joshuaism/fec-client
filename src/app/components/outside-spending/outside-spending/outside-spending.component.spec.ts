import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OutsideSpendingComponent } from './outside-spending.component';

describe('OutsideSpendingComponent', () => {
  let component: OutsideSpendingComponent;
  let fixture: ComponentFixture<OutsideSpendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OutsideSpendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OutsideSpendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
