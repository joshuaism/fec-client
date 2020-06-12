import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Contribution } from '../models/contribution';

@Injectable({
  providedIn: 'root'
})
export class FecService {

  constructor(private http: HttpClient) {

   }

  makeRequest(employers: string[], occupations: string[], committeetypes: string[], state: string) {
    let params = "?cycle=2020";
    employers.map(s => { if (s.length > 0) params = params + "&employer=" + s });
    occupations.map(s => { if (s.length > 0) params = params + "&occupation=" + s });
    if (state.length > 0) params = params + "&state=" + state;
    committeetypes.map(s => { if  (s.length > 0) params = params + "&committeetype=" + s });
    return this.http.get("http://localhost:8080/scheduleA/" + params);
  }


}
