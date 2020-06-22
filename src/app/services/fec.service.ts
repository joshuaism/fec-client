import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class FecService {

  constructor(private http: HttpClient) {

   }

  makeRequest(fromYear: number, toYear: number, names: string[], employers: string[], occupations: string[], committeetypes: string[], cities: string[], state: string) {
    let httpParams = new HttpParams();
    for(let i = fromYear; i <= toYear; i += 2) {
      httpParams = httpParams.append("cycle", "" + i);
    }
    names.map(s => { if (s.length > 0) httpParams = httpParams.append("name", s); });
    employers.map(s => { if (s.length > 0) httpParams = httpParams.append("employer", s); });
    occupations.map(s => { if (s.length > 0) httpParams = httpParams.append("occupation", s); });
    cities.map(s => { if (s.length > 0) httpParams = httpParams.append("city", s); });
    if (state && state.length > 0) httpParams = httpParams.append("state", state);;
    committeetypes.map(s => { if  (s.length > 0) httpParams = httpParams.append("committeetype", s); });
    return this.http.get("https://fecrestapi.herokuapp.com/scheduleA/", { params: httpParams });
  }


}
