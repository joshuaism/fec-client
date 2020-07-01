import { Component, OnInit, Input } from '@angular/core';
import { Contribution } from 'src/app/models/contribution';

@Component({
  selector: 'app-contribution-table',
  templateUrl: './contribution-table.component.html',
  styleUrls: ['./contribution-table.component.css']
})
export class ContributionTableComponent implements OnInit {

  @Input() contributions: Contribution[];
  @Input() cycle: string;
  uniqueContributorsMap: Map<string, Contribution>;
  uniqueContributors: Contribution[];

  constructor() { }

  ngOnInit(): void {
    this.groupByUniqueContributor(this.contributions);
    this.uniqueContributors = Array.from(this.uniqueContributorsMap.values());
    this.sort('amount');
  }

  sort(property: string) {
    this.uniqueContributors.sort((a, b) => { 
      if (property == 'location') {
        let stateCompare = this.compare(a, b, 'state');
        if (stateCompare == 0) {
          return a.city.localeCompare(b.city);
        }
        return stateCompare;
      } else if (property == 'committee') {
        let earmarkCompare = this.compare(a, b, 'earmark');
        if (earmarkCompare == 0) {
          return a.committee.name.localeCompare(b.committee.name);
        }
        return earmarkCompare;
      } else if (property == 'amount') {
        return b.amount - a.amount;
      }
      return this.compare(a, b, property);
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

  getCommitteeName(c: Contribution) {
    if (c.earmark) {
      return c.earmark.substring(0, c.earmark.lastIndexOf("(") - 1);
    }
    return c.committee.name;
  }

  getCommitteeId(c: Contribution) {
    if (c.earmark) {
      return c.earmark.substring(c.earmark.lastIndexOf("(") + 1, c.earmark.lastIndexOf(")"));
    }
    return c.committee.id;
  }

  getSum() {
    return this.contributions.reduce( (sum, c) => sum + c.amount, 0);
  }

  groupByUniqueContributor(array: Contribution[]) {
    this.uniqueContributorsMap = new Map();
    return array.map(c => {
      let key = c.fullName + c.city + c.state + c.committee.toString() + c.earmark + c.employer + c.occupation;
      let aggregate = this.uniqueContributorsMap.get(key)
      if (aggregate) {
        aggregate.date = null;
        aggregate.amount += c.amount;
      } else {
        this.uniqueContributorsMap.set(key, new Contribution(c));
      }
    })
  }
}
