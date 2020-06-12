import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-us-states',
  templateUrl: './us-states.component.html',
  styleUrls: ['./us-states.component.css']
})
export class UsStatesComponent implements OnInit {
  
  @Output() state = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  select(state: string) {
    this.state.emit(state);
  }

}
