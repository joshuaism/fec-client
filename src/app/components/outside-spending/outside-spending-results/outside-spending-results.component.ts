import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ChartData } from 'src/app/models/chart-data';
import { OutsideSpending } from 'src/app/models/outside-spending';
import { Pagination } from 'src/app/models/pagination';
import { FecService } from 'src/app/services/fec.service';

@Component({
  selector: 'app-outside-spending-results',
  templateUrl: './outside-spending-results.component.html',
  styleUrls: ['./outside-spending-results.component.css']
})
export class OutsideSpendingResultsComponent implements OnInit {

  top = "top";
  fullUrl: string;
  id: string;
  loading: boolean = true;
  pagination: Pagination;
  outsideSpending: OutsideSpending[];
  committeeIdMap: Map<string, string>;
  cycleMap: Map<string, Map<string, Map<string, OutsideSpending[]>>>;
  chartMap: Map<string, ChartData>;
  
  
  constructor(private titleService: Title, private route: ActivatedRoute, private fecService: FecService) { }

  ngOnInit(): void {
    this.route.url.subscribe(url => {
      this.fullUrl = url.reduce((fullUrl, path) => fullUrl + path + "/", "");
    })
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loading = true;
      this.id = params.get('id');
      if (this.id) {
        this.populateOutsideSpending(this.id);
      }
    });
  }

  populateOutsideSpending(id: string) {
    this.pagination = new Pagination();
    this.outsideSpending = [];
    this.committeeIdMap = new Map();
    this.cycleMap = new Map();
    this.fecService.makeOutsideSpendingRequest(id).pipe(finalize(() => { 
      this.setChartData(); 
      this.loading = false;
    }))
    .subscribe(response => {
      let res = JSON.parse(response['data']);
      this.pagination = new Pagination(res['pagination']);
      let results = res['results'];
      results.forEach(item => {
        let e = new OutsideSpending(item);
        this.outsideSpending.push(e);
        let cycle = e.committee.cycle;
        let supportOppose = e.supportOrOppose;
        let committee = e.committee.name;
        let supportMap = this.cycleMap.get(cycle);
        if (supportMap) {
          let committeeMap = supportMap.get(supportOppose);
          if (committeeMap) {
            let expenditures = committeeMap.get(committee);
            if (expenditures) {
              expenditures.push(e);
            } else {
              committeeMap.set(committee, [e]);
              this.committeeIdMap.set(committee, e.committee.id);
            }
          } else {
            committeeMap = new Map();
            committeeMap.set(committee, [e]);
            this.committeeIdMap.set(committee, e.committee.id);
            supportMap.set(supportOppose, committeeMap);
          }
        } else {
          supportMap = new Map();
          let committeeMap = new Map();
          committeeMap.set(committee, [e]);
          this.committeeIdMap.set(committee, e.committee.id);
          supportMap.set(supportOppose, committeeMap);
          this.cycleMap.set(cycle, supportMap);
        }
      });
    });
  }

  setChartData() {
    if (this.outsideSpending.length <= 0) {
      return;
    }
    this.chartMap = new Map();
    this.cycleMap.forEach((supportMap, cycle) => {
      let chartData = new ChartData();
      chartData.label = "$"
      supportMap.forEach((committeeMap, support) => {
        committeeMap.forEach((expenditures, committeeName) => {
          let sum = expenditures.reduce((sum, expenditure) => sum + expenditure.amount, 0);
          chartData.barLabels.push(committeeName);
          chartData.data.push(sum);
          chartData.colors.push(this.getColor(support));
        });
      });
      this.chartMap.set(cycle, chartData);
    });
  }

  getColor(support: string) {
    if (support == "Support") return "#d4edda";
    if (support == "Oppose") return "#f8d7da";
    return "#e2e3e5";
  }

  getCommitteeId(key: string) {
    return this.committeeIdMap.get(key);
  }

}

