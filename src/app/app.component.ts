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
  electionYears = [];
  fromYear: string;
  toYear: string;
  loading = false;
  data: Contribution[];
  cycleMap: Map<string, Map<string, Map<string, Contribution[]>>>;
  committeeIdMap: Map<string, string>;
  committeeTypeMap: Map<string, boolean>;
  state: string = "";
  pagination: Pagination;
  chartMap: Map<string, ChartData>;

  constructor(private fecService: FecService) {
    this.cycleMap = new Map();
    this.committeeIdMap = new Map();
    for(let i = 1980; i <= 2020; i += 2) {
      this.electionYears.push(i);
    }
    this.fromYear = "2020";
    this.toYear = "2020";
    console.log(this.electionYears);
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
    this.fromYear = "2020";
    this.toYear = "2020";
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
    this.cycleMap = new Map();
    this.loading = true;
    this.fecService.makeRequest(Number(this.fromYear), Number(this.toYear), this.employers, this.occupations, this.getCommitteeTypes(), this.state).subscribe(response => {
      this.pagination = new Pagination(response['pagination']);
      <any>response['results'].map(item => {
        this.data.push(new Contribution(item));
        let cycle = item.committee.cycle;
        let party = item.committee.party;
        let committee = item.committee.name;
        let partyMap = this.cycleMap.get(cycle);
        if (partyMap) {
          let committeeMap = partyMap.get(party);
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
            partyMap.set(party, committeeMap);
          }
        } else {
          partyMap = new Map();
          let committeeMap = new Map();
          committeeMap.set(committee, [new Contribution(item)]);
          this.committeeIdMap.set(committee, item.committee.id);
          partyMap.set(party, committeeMap);
          this.cycleMap.set(cycle, partyMap);
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
    this.chartMap = new Map();
    this.cycleMap.forEach( (partyMap,cycle) => {
      let chartData = new ChartData();
      chartData.label = "$";
      partyMap.forEach( (contributionMap, party) => {
        contributionMap.forEach((contributions, committeeName)=> {
          let sum = contributions.reduce( (sum, contribution) => sum + contribution.amount, 0);
          chartData.barLabels.push(committeeName);
          chartData.data.push(sum);
          chartData.colors.push(this.getColor(party));
        });
      });
      this.chartMap.set(cycle, chartData);
    })
  }

  setLocalStorage() {
    localStorage.setItem("employers", JSON.stringify(this.employers));
    localStorage.setItem("occupations", JSON.stringify(this.occupations));
    let committeetypes = { val:[...this.committeeTypeMap]};
    localStorage.setItem("committeetypes", JSON.stringify(committeetypes));
    localStorage.setItem("fromYear", this.fromYear);
    localStorage.setItem("toYear", this.toYear);
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
    if (localStorage.getItem("fromYear")) {
      this.fromYear = localStorage.getItem("fromYear");
    }
    if (localStorage.getItem("toYear")) {
      this.toYear = localStorage.getItem("toYear");
    }
    if (localStorage.getItem("state")) {
      this.state = localStorage.getItem("state");
    }
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

  onFromElectionYearsChange() {
    if (this.fromYear > this.toYear) {
      console.log("reset");
      this.toYear = this.fromYear;
    }
  }

  toElectionYears() {
    return this.electionYears.slice(this.electionYears.findIndex((val, i) => this.fromYear == val));
  }

  getCommitteeId(key: string) {
    return this.committeeIdMap.get(key);
  }

  getContributions(cycle: string, party: string, committee: string): Contribution[] {
    return this.cycleMap.get(cycle).get(party).get(committee);
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
