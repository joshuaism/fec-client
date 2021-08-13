import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Candidate } from 'src/app/models/candidate';

@Component({
  selector: 'app-outside-spending',
  templateUrl: './outside-spending.component.html',
  styleUrls: ['./outside-spending.component.css']
})
export class OutsideSpendingComponent implements OnInit {

  id: string;

  constructor(private titleService: Title, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.titleService.setTitle("Outside Spending Search");
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
  }

  setCandidate(value: Candidate) {
    if (value) {
      this.id = value.id;
      this.router.navigate(['/outside-spending/candidate/', value.id], {state: value});
      
    }
  }

}
