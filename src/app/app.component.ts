import { Component } from '@angular/core';
import { KeyValue } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fec';

  names = [""];
  employers = [""];
  occupations = [""];
  cities = [""];
  state: string = "";
  electionYears = [];
  fromYear: string;
  toYear: string;
  committeeTypeMap: Map<string, boolean>;

  routeSubscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    for(let i = 1980; i <= 2020; i += 2) {
      this.electionYears.push(i);
    }
    this.fromYear = "2020";
    this.toYear = "2020";
    this.routeSubscription = this.route.queryParamMap.subscribe(params => {
      this.paramsChange(params);
    });
  }

  paramsChange(params: ParamMap) {
    this.renewCommitteeTypeMap();
    if (params.keys.length <= 0) {
      this.retrieveLocalStorage();
      return;
    }
    this.fromYear = params.get('fromYear') || "1980";
    this.toYear = params.get('toYear') || "2020";
    this.names = params.get('name')? params.getAll('name') : [""];
    this.employers = params.get('employer')? params.getAll('employer') : [""];
    this.occupations = params.get('occupation')? params.getAll('occupation') : [""];
    params.getAll('committeetype').every(s => {this.committeeTypeMap.set(s, true)});
    this.cities = params.get('city')? params.getAll('city') : [""];
    this.state = params.get('state') || "";
  }

  // preserve committee type checkbox order
  originalOrder = (a: KeyValue<string,boolean>, b: KeyValue<string,boolean>): number => {
    return 0;
  }

  clearForm() {
    this.names = [""];
    this.employers = [""];
    this.occupations = [""];
    this.cities = [""];
    this.state = "";
    this.renewCommitteeTypeMap();
    this.fromYear = "2020";
    this.toYear = "2020";
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
    this.setLocalStorage();
    this.router.navigate(['results'], {queryParams: this.getParams()})
  }

  getParams() {
    let params = {};
    if (this.fromYear != "1980") {
      params['fromYear'] = this.fromYear;
    }
    if(this.toYear != "2020") {
      params['toYear'] = this.toYear;
    }
    this.addParam(params, this.names, 'name');
    this.addParam(params, this.employers, 'employer');
    this.addParam(params, this.occupations, 'occupation');
    this.addParam(params, this.cities, 'city');
    if (this.state && this.state.length > 0) {
      params['state'] = this.state;
    }
    this.committeeTypeMap.forEach((checked, type) => {
      if(checked) {
        if (!params['committeetype']) {
          params['committeetype'] = [];
        }
        params['committeetype'].push(type);
      }
    });
    return params;
  }

  addParam(params: {}, args: string[], field: string) {
    args.map(s => { 
      if (s.length > 0) {
        if (!params[field]) {
          params[field] = [];
        }
        params[field].push(s)
      }
    });
  }

  setLocalStorage() {
    localStorage.setItem("names", JSON.stringify(this.names));
    localStorage.setItem("employers", JSON.stringify(this.employers));
    localStorage.setItem("occupations", JSON.stringify(this.occupations));
    localStorage.setItem("cities", JSON.stringify(this.cities));
    localStorage.setItem("state", this.state);
    let committeetypes = { val:[...this.committeeTypeMap]};
    localStorage.setItem("committeetypes", JSON.stringify(committeetypes));
    localStorage.setItem("fromYear", this.fromYear);
    localStorage.setItem("toYear", this.toYear);
  }

  retrieveLocalStorage() {
    if (localStorage.getItem("names")) {
      this.names = JSON.parse(localStorage.getItem("names"));
    }
    if (localStorage.getItem("employers")) {
      this.employers = JSON.parse(localStorage.getItem("employers"));
    }
    if (localStorage.getItem("occupations")) {
      this.occupations = JSON.parse(localStorage.getItem("occupations"));
    }
    if (localStorage.getItem("cities")) {
      this.cities = JSON.parse(localStorage.getItem("cities"));
    }
    if (localStorage.getItem("state")) {
      this.state = localStorage.getItem("state");
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
  }

  setState(state: string) {
    this.state = state;
  }

  onFromElectionYearsChange() {
    if (this.fromYear > this.toYear) {
      this.toYear = this.fromYear;
    }
  }

  toElectionYears() {
    return this.electionYears.slice(this.electionYears.findIndex((val, i) => this.fromYear == val));
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }
}
