import { Component } from '@angular/core';
import { FecService } from './services/fec.service';
import { Contribution } from './models/contribution';

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

  constructor(private fecService: FecService) {
    this.partyMap = new Map();
    this.committeeIdMap = new Map();
  }

  addEmployer() {
    if (this.employers[this.employers.length - 1].length > 0) {
      this.employers.push("");
    }
  }

  addOccupation() {
    if (this.occupations[this.occupations.length - 1].length > 0) {
      this.occupations.push("");
    }
  }

  customTrackBy(index: number, obj: any) {
    return index;
  }

  submit() {
    this.data = new Array<Contribution>();
    this.partyMap = new Map();
    this.loading = true;
    this.fecService.makeRequest(this.employers, this.occupations).subscribe(response => {
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

  getCommitteeId(key: string) {
    console.log(this.committeeIdMap.get(key));
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
