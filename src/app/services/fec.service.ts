import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FecService {

  constructor(private http: HttpClient) {

   }

  makeRequest(fromYear: number, toYear: number, names: string[], employers: string[], occupations: string[], committeetypes: string[], cities: string[], state: string) {
    let params = "?cycle=" + fromYear;
    for(let i = fromYear + 2; i <= toYear; i += 2) {
      params = params + "&cycle=" + i;
    }
    names.map(s => { if (s.length > 0) params = params + "&name=" + s });
    employers.map(s => { if (s.length > 0) params = params + "&employer=" + s });
    occupations.map(s => { if (s.length > 0) params = params + "&occupation=" + s });
    cities.map(s => { if (s.length > 0) params = params + "&city=" + s });
    if (state && state.length > 0) params = params + "&state=" + state;
    committeetypes.map(s => { if  (s.length > 0) params = params + "&committeetype=" + s });
    return this.http.get("https://fecrestapi.herokuapp.com/scheduleA/" + params);
  }


}
