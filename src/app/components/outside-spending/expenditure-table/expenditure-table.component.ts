import { Component, Input, OnInit } from '@angular/core';
import { OutsideSpending } from 'src/app/models/outside-spending';

@Component({
  selector: 'app-expenditure-table',
  templateUrl: './expenditure-table.component.html',
  styleUrls: ['./expenditure-table.component.css']
})
export class ExpenditureTableComponent implements OnInit {

  @Input() expenditures: OutsideSpending[];
  uniqueExpendituresMap: Map<string, OutsideSpending>;
  uniqueExpenditures: OutsideSpending[];

  constructor() { }

  ngOnInit(): void {
    this.groupByUniqueExpenditure(this.expenditures);
    this.uniqueExpenditures = Array.from(this.uniqueExpendituresMap.values());
    this.sort('amount');
  }

  groupByUniqueExpenditure(array: OutsideSpending[]) {
    this.uniqueExpendituresMap = new Map();
    return array.map(e => {
      let key = e.candidate + e.candidateParty + e.committee.toString() + e.description + e.payee + e.supportOrOppose;
      let aggregate = this.uniqueExpendituresMap.get(key);
      if (aggregate) {
        if (aggregate.date != e.date) {
          aggregate.date = null;
        }
        aggregate.amount += e.amount;
      } else {
        this.uniqueExpendituresMap.set(key, new OutsideSpending(e));
      }
    })
  }

  sort(property: string) {
    this.uniqueExpenditures.sort((a, b) => {
      if (property == 'committee') {
        return a.committee.name.localeCompare(b.committee.name);
      } else if (property == 'amount') {
        return b.amount - a.amount;
      }
      return this.compare(a, b, property)
    });
  }

  compare(a, b, property: string) {
    if (a[property]) {
      if (b[property]) {
        return a[property].localeCompare(b[property]);
      }
      return -1;
    } else {
      if (b[property]) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  getSum() {
    return this.expenditures.reduce( (sum, c) => sum + c.amount, 0);
  }
}
