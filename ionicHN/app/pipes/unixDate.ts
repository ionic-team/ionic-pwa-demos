import { Injectable, Pipe } from '@angular/core';

/*
  Generated class for the UnixDate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'unixDate'
})
@Injectable()
export class UnixDate {
  /*
    Takes a value and makes it lowercase.
   */
  transform(value: number, args: any[]) {
    let date = new Date(value * 1000);
    return date;
  }
}
