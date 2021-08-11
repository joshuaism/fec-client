import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-outside-spending',
  templateUrl: './outside-spending.component.html',
  styleUrls: ['./outside-spending.component.css']
})
export class OutsideSpendingComponent implements OnInit {

  constructor(private titleService: Title) { }

  ngOnInit(): void {
    this.titleService.setTitle("Outside Spending Search");
  }

}
