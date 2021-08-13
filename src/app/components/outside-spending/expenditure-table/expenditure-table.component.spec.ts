import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditureTableComponent } from './expenditure-table.component';

describe('ExpenditureTableComponent', () => {
  let component: ExpenditureTableComponent;
  let fixture: ComponentFixture<ExpenditureTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenditureTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
