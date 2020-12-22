import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SummaryApiService {
  private URL = 'https://api.okazakilab.org/';
  // private URL = 'http://localhost:8000/'
  private httpOptions: object = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + environment.apiKey})
  };
  private loggerURL = '/api/logger/access/';

  constructor(private http: HttpClient) { }

  getSummary(article, model, length?, keywords?): Observable<string> {
    const body: object = { src: [article], model, length, keywords: [keywords] }
    let ret: string;
    return this.http.post<string>(this.URL + 'generate', body, this.httpOptions)
      .pipe(
        tap(data => {
          const body = {
            summary: data['0']['hypos'][0],
            keywords: data['0']['keywords'],
            src: data['0']['src']
          };
          this.http.post(this.loggerURL, body).subscribe();
        }),
        catchError(error => {
          console.log(error);
          return 'Api Server Error';
        })
      );
  }
}
