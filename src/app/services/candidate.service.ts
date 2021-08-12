import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(private http: HttpClient) { }

  getCandidates(filter: string): Observable<Object> {
    let name = filter.split("|");
    let httpParams = new HttpParams();
    if (name[0] && name[0].length > 0) httpParams = httpParams.append("name", name[0]);
    return this.http.get("https://fecrestapi.herokuapp.com/candidates/?" + httpParams.toString());
  }
}
