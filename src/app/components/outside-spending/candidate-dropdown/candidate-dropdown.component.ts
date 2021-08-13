import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { Candidate } from 'src/app/models/candidate';
import { CandidateService } from 'src/app/services/candidate.service';

@Component({
  selector: 'app-candidate-dropdown',
  templateUrl: './candidate-dropdown.component.html',
  styleUrls: ['./candidate-dropdown.component.css']
})
export class CandidateDropdownComponent implements OnInit {

  @Output() notify: EventEmitter<Candidate> = new EventEmitter<Candidate>();
  myControl = new FormControl();
  candidateMap: Map<String, Candidate>;
  filteredOptions: Observable<String[]>;

  constructor(private service: CandidateService) {

  }

  ngOnInit() {
    this.candidateMap = new Map();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.myControl.valueChanges.subscribe(val => {
        this.notify.emit(this.candidateMap.get(val));
    });
  }

  private _filter(value: any): String[] {
    if (this.candidateMap.has(value)) {
      return [value];
    }
    let arr = value.toLowerCase().split(" ");
    const filters = arr.filter(e => e.length > 0);

    if (Array.from(this.candidateMap.keys()).filter(key => 
      filters.every(e => key.toLowerCase().includes(e))).length <= 5 ) {
      this.service.getCandidates(value).subscribe(res => 
        res['results'].map(val => {
          var c = new Candidate(val);
          var key = c.toString();
          this.candidateMap.set(key, c);
        }));
    }

    return Array.from(this.candidateMap.keys()).filter(key => 
      filters.every(e => key.toLowerCase().includes(e))
    );
  }

}
