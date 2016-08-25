import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Creds provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Creds {

  constructor(private http: Http) { }

  public login(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        let username = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
          username += possible.charAt(Math.floor(Math.random() * possible.length));
        }
  
        localStorage.setItem('chattyUsername', username);
        resolve(username);
      } catch (e) {
        reject(e);
      }
    });
  }

  public get_username(): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        resolve(localStorage.getItem('chattyUsername'));
      } catch (e) {
        reject(e);
      }
    });
  }

}

