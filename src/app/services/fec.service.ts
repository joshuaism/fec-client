import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { Contribution } from '../models/contribution';

@Injectable({
  providedIn: 'root'
})
export class FecService {

  constructor(private http: HttpClient) {

   }

  makeRequest(employers: string[], occupations: string[]) {

    let params = "?cycle=2020";
    employers.map(s => { if (s.length > 0) params = params + "&employer=" + s });
    occupations.map(s => { if (s.length > 0) params = params + "&occupation=" + s });
    return this.http.get("http://localhost:8080/scheduleA/" + params);
  }


}
