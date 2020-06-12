import { Component } from '@angular/core';
import { FecService } from './services/fec.service';
import { Contribution } from './models/contribution';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'fec';

  employers = [""];
  occupations = [""];
  loading = false;
  data: Contribution[];
  partyMap: Map<string, Map<string, Contribution[]>>;
  committeeIdMap: Map<string, string>;
  committeeTypeMap: Map<string, boolean>;
  state: string;

  constructor(private fecService: FecService) {
    this.partyMap = new Map();
    this.committeeIdMap = new Map();
    this.committeeTypeMap = new Map();
    this.committeeTypeMap.set("President", false);
    this.committeeTypeMap.set("Senate", false);
    this.committeeTypeMap.set("House", false);
    this.committeeTypeMap.set("Other", false);
  }

  originalOrder = (a: KeyValue<string,boolean>, b: KeyValue<string,boolean>): number => {
    return 0;
  }

  submit() {
    this.data = new Array<Contribution>();
    this.partyMap = new Map();
    this.loading = true;
    this.fecService.makeRequest(this.employers, this.occupations, this.getCommitteeTypes(), this.state).subscribe(response => {
      <any>response['results'].map(item => {
        this.data.push(new Contribution(item));
        let party = item.committee.party;
        let committee = item.committee.name;
        let committeeMap = this.partyMap.get(party);
        if (committeeMap) {
          let contributions = committeeMap.get(committee);
          if (contributions) {
            contributions.push(new Contribution(item));
          } else {
            committeeMap.set(committee, [new Contribution(item)]);
            this.committeeIdMap.set(committee, item.committee.id);
          }
        } else {
          committeeMap = new Map();
          committeeMap.set(committee, [new Contribution(item)]);
          this.committeeIdMap.set(committee, item.committee.id);
          this.partyMap.set(party, committeeMap);
        }
      });
      this.loading = false;
    });
  }

  setState(state: string) {
    this.state = state;
  }

  getCommitteeTypes(): string[] {
    let committeeTypes = [];
    this.committeeTypeMap.forEach( (val, key) => {
      if (val) {
        if (key == "Other") {
          committeeTypes.push(..."CDEINOQUVWXYZ".split(''))
        } else {
          committeeTypes.push(key.substring(0, 1));
        }
      }
    })
    return committeeTypes;
  }

  getCommitteeId(key: string) {
    return this.committeeIdMap.get(key);
  }

  getContributions(party: string, committee: string): Contribution[] {
    return this.partyMap.get(party).get(committee);
  }

  getParty(party: String) {
    if (party.indexOf("DEMOCRATIC") > -1) {
      return "democratic party";
    }
    if (party.indexOf("REPUBLICAN") > -1) {
      return "republican party";
    }
    if (party.indexOf("LIBERTARIAN") > -1) {
      return "libertarian party";
    }
    if (party.indexOf("GREEN") > -1) {
      return "green party";
    }
    return "other party";
  }
}
