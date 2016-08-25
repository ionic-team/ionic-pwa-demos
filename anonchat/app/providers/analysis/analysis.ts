import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the Analysis provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Analysis {

  scores: any[];

  constructor(private http: Http) {
    this.scores = [];
  }

  public addScore(score: number) {
    this.scores.push(score);
    console.log(this.scores);
  }

  public getScores() {
    return this.scores;
  }

}

