import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { OutsideSpending } from 'src/app/models/outside-spending';
import { Pagination } from 'src/app/models/pagination';
import { FecService } from 'src/app/services/fec.service';

@Component({
  selector: 'app-outside-spending-results',
  templateUrl: './outside-spending-results.component.html',
  styleUrls: ['./outside-spending-results.component.css']
})
export class OutsideSpendingResultsComponent implements OnInit {

  id: string;
  loading: boolean = true;
  pagination: Pagination;
  outsideSpending: OutsideSpending[];
  
  constructor(private titleService: Title, private route: ActivatedRoute, private fecService: FecService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.loading = true;
      this.id = params.get('id');
      this.pagination = new Pagination();
      this.outsideSpending = [];
      if (this.id) {
        this.populateOutsideSpending(this.id);
      }
    });
  }

  populateOutsideSpending(id: string) {
    this.pagination = new Pagination();
    this.outsideSpending = [];
    this.fecService.makeOutsideSpendingRequest(id).pipe(finalize(() => { 
      //TODO populate the page
      this.loading = false;
    }))
    .subscribe(response => {
      let res = JSON.parse(response['data']);
      this.pagination = new Pagination(res['pagination']);
      let results = res['results'];
      results.forEach(e => {
        this.outsideSpending.push(new OutsideSpending(e));
      });
    });
  }

}

