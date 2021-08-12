import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { finalize } from 'rxjs/operators';
import { Candidate } from 'src/app/models/candidate';
import { OutsideSpending } from 'src/app/models/outside-spending';
import { FecService } from 'src/app/services/fec.service';

@Component({
  selector: 'app-outside-spending',
  templateUrl: './outside-spending.component.html',
  styleUrls: ['./outside-spending.component.css']
})
export class OutsideSpendingComponent implements OnInit {

  outsideSpending: OutsideSpending[];

  constructor(private titleService: Title, private fecService: FecService) { }

  ngOnInit(): void {
    this.titleService.setTitle("Outside Spending Search");
  }

  setCandidate(value: Candidate) {
    this.outsideSpending = [];
    if (value) {
      this.fecService.makeOutsideSpendingRequest(value.id).pipe(finalize(() => { 
        //TODO populate the page
      }))
      .subscribe(response => {
        let res = JSON.parse(response['data']);
        let results = res['results'];
        results.forEach(e => {
          this.outsideSpending.push(new OutsideSpending(e));
        });
      });
    }
  }

}
