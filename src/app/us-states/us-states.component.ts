import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-us-states',
  templateUrl: './us-states.component.html',
  styleUrls: ['./us-states.component.css']
})
export class UsStatesComponent implements OnInit {

  @Input() state: string;
  @Output() selection = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  select(selection: string) {
    this.selection.emit(selection);
  }

}
