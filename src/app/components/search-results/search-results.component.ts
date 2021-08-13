import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Contribution } from 'src/app/models/contribution';
import { Pagination } from 'src/app/models/pagination';
import { ChartData } from 'src/app/models/chart-data';
import { finalize } from 'rxjs/operators';
import { FecService } from 'src/app/services/fec.service';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {

  top = "top";
  fullUrl: string;
  loading = false;
  data: Contribution[];
  cycleMap: Map<string, Map<string, Map<string, Contribution[]>>>;
  committeeIdMap: Map<string, string>;
  committeeTypeMap: Map<string, boolean>;
  pagination: Pagination;
  chartMap: Map<string, ChartData>;

  routeSubscription;

  constructor(private titleService: Title, private fecService: FecService, private route: ActivatedRoute, private changeDetection: ChangeDetectorRef) {
    this.route.url.subscribe(url => {
      this.fullUrl = url.reduce((fullUrl, path) => fullUrl + path + "/", "");
    })
    this.routeSubscription = this.route.queryParamMap.subscribe(params => {
      this.paramsChange(params);
    });
  }

  ngOnInit(): void {

  }

  paramsChange(params) {
    this.changeDetection.markForCheck();
    this.data = new Array<Contribution>();
    this.pagination = new Pagination();
    this.cycleMap = new Map();
    this.committeeIdMap = new Map();
    this.loading = true;

    let fromYear = params.get('fromYear') || 1980;
    let toYear = params.get('toYear') || 2022;
    let names = params.getAll('name');
    let employers = params.getAll('employer');
    let occupations = params.getAll('occupation');
    let committeeTypes = params.getAll('committeetype');
    let committees = params.getAll('committee');
    let cities = params.getAll('city');
    let state = params.get('state');

    let request = this.fecService.makeRequest(Number(fromYear), Number(toYear), names, employers,
      occupations, this.getCommitteeTypes(committeeTypes), cities, state, committees)
      .pipe(finalize(() => { 
        this.setChartData(); 
        this.changeDetection.markForCheck(); 
        this.loading = false; 
        this.titleService.setTitle(names + " " +
          employers + " " +
          occupations + " " +
          cities + " " + 
          committees + " " + 
          fromYear + "-" + toYear + 
          " - Contribution Search");
      }))
      .subscribe(response => {
        let res = JSON.parse(response['data']);
        this.pagination = new Pagination(res['pagination']);
        <any>res['results'].map(item => {
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
      });
  }

  setChartData() {
    if (this.data.length <= 0) {
      return;
    }
    this.chartMap = new Map();
    this.cycleMap.forEach((partyMap, cycle) => {
      let chartData = new ChartData();
      chartData.label = "$";
      partyMap.forEach((contributionMap, party) => {
        contributionMap.forEach((contributions, committeeName) => {
          let sum = contributions.reduce((sum, contribution) => sum + contribution.amount, 0);
          chartData.barLabels.push(committeeName);
          chartData.data.push(sum);
          chartData.colors.push(this.getColor(party));
        });
      });
      this.chartMap.set(cycle, chartData);
    })
  }

  getCommitteeTypes(committeeTypes: string[]): string[] {
    let returnValues = [];
    committeeTypes.forEach(val => {
      if (val == "Other") {
        returnValues.push(..."CDEINOQUVWXYZ".split(''))
      } else {
        returnValues.push(val.substring(0, 1));
      }
    })
    return returnValues;
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

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
  }

}
