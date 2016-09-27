import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

/*
  Generated class for the ContactData provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ContactData {
  data: any;
  hasRequestPending: boolean = false;

  constructor(private http: Http) {}

  load() {
    let url = 'https://jsonplaceholder.typicode.com/users';

    if (this.data) {
      // already loaded data
      return Promise.resolve(this.data);
    }

    // don't have the data yet
    return new Promise(resolve => {
      // We're using Angular Http provider to request the data,
      // then on the response it'll map the JSON data to a parsed JS object.
      // Next we process the data and resolve the promise with the new data.
      this.hasRequestPending = true;

      this.http
        .get(url)
        .map(
          res => {
            // If the request fails, throw an Error that will be caught
            if (res.status !== 200) {
              throw new Error('This request has failed ' + res.status);
            // If everything went fine, return the response
            } else {
              return res.json();
            }
          }

        )
        .subscribe(
          data => {
            this.updateData(data);
            resolve(data);
          }, err => this.logError(err));
    });
  }

  updateData(data: any) {
    // console.log('Setting new data', data);
    this.data = data;
  }

  logError(error: any) {
    // console.log('Oh no, error', error);
  }

}

