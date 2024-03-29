import { Component, OnInit, Input } from '@angular/core';
import { ChartData } from '../../models/chart-data';
import { formatCurrency } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor(private router: Router) { }

  @Input() url: string;
  @Input() cycle: string;
  @Input() label: string;
  @Input() chartData: ChartData;

  public barChartOptions = {
    responsive: true, maintainAspectRatio: false,
    onClick:  (evt, item) => {
      if (item.length > 0) {
        let label = item[0]._model.label;
        if (label instanceof Array) {
          label = label.join('').trim();
        }
        this.router.navigate([this.url], { queryParamsHandling: "preserve", fragment: this.cycle + label });
      }
    },
    tooltips: {callbacks: { label: function(item) {return formatCurrency(item.value, 'en', '$', 'USD')}}},
    scales: { yAxes: [{ticks: {autoSkip: false}, gridLines: { display: false }}], xAxes: [{type: 'linear', ticks: {min: 0, callback: function(tick) {return tick.toLocaleString()}} }]}
  };
  public barChartLabels = [];
  public barChartType = 'horizontalBar';
  public barChartLegend = false; 
  public barChartData = [
    { data: [], label: "", barPercentage: 1.0, categoryPercentage: 1.0, 
      backgroundColor: [] }
  ];
  
  ngOnInit(): void {
    this.barChartLabels = this.wordWrap(this.chartData.barLabels);
    this.barChartData[0].data = this.chartData.data;
    this.barChartData[0].label = this.chartData.label;
    this.barChartData[0].backgroundColor = this.chartData.colors;
    this.barChartOptions.scales.xAxes = this.setAxes();
  }

  wordWrap(strings: string[]): any[] {
    let wordWrap = [];
    strings.forEach(s => {
      let array = [];
      if (s.length > 50) {
        let line = "";
        let words = s.split(' ');
        words.forEach(w => {
          line += w + " ";
          if (line.length > 50) {
            array.push(line);
            line = "";
          }
        });
        array.push(line);
        wordWrap.push(array);
      } else {
        wordWrap.push(s);
      }
    })
    return wordWrap;
  }

  getHeight() {
    if (this.chartData.data.length <= 5) {
      return 100;
    }
    if (this.chartData.data.length <= 10) {
      return 200;
    }
    return 23 * this.chartData.data.length + 100;
  }

  setAxes() {
    return [{type: this.getAxesType(), ticks: {min: 0, callback: function(tick) {return tick.toLocaleString()}} }];
  }

  getAxesType(): string {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    this.chartData.data.map(val => {
      if (val > max) max = val;
      if (val < min) min = val;
    })
    if (max - min < 10000) {
      return 'linear';
    }
    return 'logarithmic';
  }

}

