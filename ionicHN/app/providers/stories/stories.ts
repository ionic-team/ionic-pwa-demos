import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';


@Injectable()
export class StoriesService {

  constructor(private http: Http) {

  }

  public getStories(): Observable<any> {
    return this.http.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getAskStories(): Observable<any> {
    return this.http.get('https://hacker-news.firebaseio.com/v0/askstories.json?print=pretty')
      .map(this.extractData)
      .catch(this.handleError)
  }

  public getShowStories(): Observable<any> {
    return this.http.get('https://hacker-news.firebaseio.com/v0/showstories.json?print=pretty')
      .map(this.extractData)
      .catch(this.handleError)
  }

  public getJobStories(): Observable<any> {
    return this.http.get('https://hacker-news.firebaseio.com/v0/jobstories.json?print=pretty')
      .map(this.extractData)
      .catch(this.handleError);
  }

  public getStory(storyId: number): Observable<any> {
    return this.http.get(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json?print=pretty`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
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
