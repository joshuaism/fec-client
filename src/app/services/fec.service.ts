import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Contribution } from '../models/contribution';

@Injectable({
  providedIn: 'root'
})
export class FecService {

  constructor(private http: HttpClient) {

   }

  makeRequest(fromYear: number, toYear: number, employers: string[], occupations: string[], committeetypes: string[], state: string) {
    let params = "?cycle=" + fromYear;
    for(let i = fromYear + 2; i <= toYear; i += 2) {
      params = params + "&cycle=" + i;
    }
    employers.map(s => { if (s.length > 0) params = params + "&employer=" + s });
    occupations.map(s => { if (s.length > 0) params = params + "&occupation=" + s });
    if (state && state.length > 0) params = params + "&state=" + state;
    committeetypes.map(s => { if  (s.length > 0) params = params + "&committeetype=" + s });
    return this.http.get("http://localhost:8080/scheduleA/" + params);
  }


}
