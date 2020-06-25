import { Component, OnInit, Input } from '@angular/core';
import { ChartData } from '../models/ChartData';
import { formatCurrency } from '@angular/common';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {

  constructor() { }

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
       location.href = "#" + this.cycle + label
      }
    },
    tooltips: {callbacks: { label: function(item) {return formatCurrency(item.value, 'en', '$', 'USD')}}},
    scales: { yAxes: [{ticks: {autoSkip: false}, gridLines: { display: false }}], xAxes: [{type: 'logarithmic', ticks: {min: 0, callback: function(tick) {return tick.toLocaleString()}} }]}
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
    return 23 * this.chartData.data.length + 100;
  }

}

