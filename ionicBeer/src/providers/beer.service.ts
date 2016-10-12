import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


@Injectable()
export class BeerService {

  constructor(private http: Http) { }

  getBeerList(): Observable<any> {
    return this.http.get('https://glacial-forest-35899.herokuapp.com/beers')
      .map(this.extractData)
      .catch(this.handleError)
  }

  searchBeers(searchTerm: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      searchTerm: searchTerm
    });
    return this.http.post('https://glacial-forest-35899.herokuapp.com/search', body, options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  getLocalBeer(position): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      lat: position.coords.latitude,
      long: position.coords.longitude
    });
    return this.http.post('https://glacial-forest-35899.herokuapp.com/local', body, options)
      .map(this.extractData)
      .catch(this.handleError)
  }

  pictureSearch(file: any): Observable<any> {
    return this.http.post('https://glacial-forest-35899.herokuapp.com/picture', file)
      .map(this.extractData)
      .catch(this.handleError)
  }

  private extractData(res: Response) {
    let body = res.json();
    return body.data || {};
  }

  private handleError(error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
