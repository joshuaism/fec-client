import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import { SseService } from './SseService';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FecService {

  constructor(private _zone: NgZone, private _sseService: SseService) {

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
    return Observable.create(observer => {
      const eventSource = this._sseService.getEventSource("https://fecrestapi.herokuapp.com/stream/?" + httpParams.toString());

      eventSource.onmessage = event => {
        this._zone.run(() => {
          observer.next(event);
        });
      };

      eventSource.onerror = error => {
        this._zone.run(() => {
          observer.error(error);
          eventSource.close();
        });
      };
    })
  }


}
