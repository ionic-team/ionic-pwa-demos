import { Injectable } from '@angular/core';
import { Headers, RequestOptions, Response, Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';


/*
  Generated class for the Chat provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Chat {

  rooms: any[];
  pushed: boolean;

  constructor(private http: Http) {
    this.rooms = [];
    console.log(localStorage.getItem('anonPushed'));
    if (localStorage.getItem('anonPushed') === 'null') {
      this.pushed = false;
    } else {
      this.pushed = true;
    }
  }

  public init_chat(roomName: string): any {
    let socket = io.connect(`http://localhost:8080/${roomName}`);
    socket.on('connected', () => {
      console.log('connected');
    });
    return socket;
  }

  public retrieveRooms() {
    return this.http.get('http://localhost:8080/rooms')
      .map(this.extractData)
      .catch(this.handleError);
  }

  public add_room(name: string, desc: string) {
    this.rooms.push({ name: name, desc: desc });
  }

  public newRoom(name: string, desc: string): Observable<any> {
    let body = JSON.stringify({ name, desc });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('http://localhost:8080/newRoom', body, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  public postServerKey(): Observable<any> {
    console.log(localStorage.getItem('anonPushed'));
    if (localStorage.getItem('anonPushed') !== 'true' && localStorage.getItem('anonKey') !== null) {
      this.pushed = true;
      console.log('posting server key');
      localStorage.setItem('anonPushed', 'true');
      let body = JSON.stringify({ user: localStorage.getItem('chattyUsername'), key: localStorage.getItem('anonKey') });
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let options = new RequestOptions({ headers: headers });

      return this.http.post('http://localhost:8080/newKey', body, options)
        .map(this.extractData)
        .catch(this.handleError);
    } else {
      console.log('key already pushed');
    }
  }

  private extractData(res: Response) {
    console.log(res);
    return res;
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

