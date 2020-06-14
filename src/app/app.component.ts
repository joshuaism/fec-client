import { Component } from '@angular/core';
import { FecService } from './services/fec.service';
import { Contribution } from './models/contribution';
import { KeyValue } from '@angular/common';
import { Pagination } from './models/pagination';
import { ChartData } from './models/ChartData';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fec';

  employers = [""];
  occupations = [""];
  loading = false;
  data: Contribution[];
  partyMap: Map<string, Map<string, Contribution[]>>;
  committeeIdMap: Map<string, string>;
  committeeTypeMap: Map<string, boolean>;
  state: string = "";
  pagination: Pagination;
  chartData: ChartData;

  constructor(private fecService: FecService) {
    this.partyMap = new Map();
    this.committeeIdMap = new Map();
    this.renewCommitteeTypeMap();
    this.retrieveLocalStorage();
  }

  originalOrder = (a: KeyValue<string,boolean>, b: KeyValue<string,boolean>): number => {
    return 0;
  }

  clearForm() {
    this.employers = [""];
    this.occupations = [""];
    this.renewCommitteeTypeMap();
    this.state = "";
    localStorage.clear();
  }

  renewCommitteeTypeMap() {
    this.committeeTypeMap = new Map();
    this.committeeTypeMap.set("President", false);
    this.committeeTypeMap.set("Senate", false);
    this.committeeTypeMap.set("House", false);
    this.committeeTypeMap.set("Other", false);
  }

  submit() {
    this.data = new Array<Contribution>();
    this.partyMap = new Map();
    this.loading = true;
    this.fecService.makeRequest(this.employers, this.occupations, this.getCommitteeTypes(), this.state).subscribe(response => {
      this.pagination = new Pagination(response['pagination']);
      <any>response['results'].map(item => {
        this.data.push(new Contribution(item));
        let party = item.committee.party;
        let committee = item.committee.name;
        let committeeMap = this.partyMap.get(party);
        if (committeeMap) {
          let contributions = committeeMap.get(committee);
          if (contributions) {
            contributions.push(new Contribution(item));
          } else {
            committeeMap.set(committee, [new Contribution(item)]);
            this.committeeIdMap.set(committee, item.committee.id);
          }
        } else {
          committeeMap = new Map();
          committeeMap.set(committee, [new Contribution(item)]);
          this.committeeIdMap.set(committee, item.committee.id);
          this.partyMap.set(party, committeeMap);
        }
      });
      this.setChartData();
      this.setLocalStorage();
      this.loading = false;
    });
  }

  setChartData() {
    if (this.data.length <= 0) {
      return;
    }
    let chartData = new ChartData();
    chartData.label = "$";
    this.partyMap.forEach( (contributionMap, party) => {
      contributionMap.forEach((contributions, committeeName)=> {
        let sum = contributions.reduce( (sum, contribution) => sum + contribution.amount, 0);
        chartData.barLabels.push(committeeName);
        chartData.data.push(Number(sum.toFixed(2)));
        chartData.colors.push(this.getColor(party));
      });
    });
    this.chartData = chartData;
  }

  setLocalStorage() {
    localStorage.setItem("employers", JSON.stringify(this.employers));
    localStorage.setItem("occupations", JSON.stringify(this.occupations));
    let committeetypes = { val:[...this.committeeTypeMap]};
    localStorage.setItem("committeetypes", JSON.stringify(committeetypes));
    localStorage.setItem("state", this.state);
  }

  retrieveLocalStorage() {
    if (localStorage.getItem("employers")) {
      this.employers = JSON.parse(localStorage.getItem("employers"));
    }
    if (localStorage.getItem("occupations")) {
      this.occupations = JSON.parse(localStorage.getItem("occupations"));
    }
    if (localStorage.getItem("committeetypes")) {
      this.committeeTypeMap = new Map(JSON.parse(localStorage.getItem("committeetypes")).val);
    }
    this.state = localStorage.getItem("state");
  }

  setState(state: string) {
    this.state = state;
  }

  getCommitteeTypes(): string[] {
    let committeeTypes = [];
    this.committeeTypeMap.forEach( (val, key) => {
      if (val) {
        if (key == "Other") {
          committeeTypes.push(..."CDEINOQUVWXYZ".split(''))
        } else {
          committeeTypes.push(key.substring(0, 1));
        }
      }
    })
    return committeeTypes;
  }

  getCommitteeId(key: string) {
    return this.committeeIdMap.get(key);
  }

  getContributions(party: string, committee: string): Contribution[] {
    return this.partyMap.get(party).get(committee);
  }

  getColor(party: String) {
    if (party.indexOf("DEMOCRATIC") > -1) {
      return "#cce5ff";
    }
    if (party.indexOf("REPUBLICAN") > -1) {
      return "#f8d7da";
    }
    if (party.indexOf("LIBERTARIAN") > -1) {
      return "#fff3cd";
    }
    if (party.indexOf("GREEN") > -1) {
      return "#d4edda";
    }
    return "#e2e3e5";
  }
}
