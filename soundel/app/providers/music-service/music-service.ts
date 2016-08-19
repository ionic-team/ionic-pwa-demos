import {Injectable} from '@angular/core';

declare var SC: any;

/*
  Generated class for the MusicService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MusicService {

  constructor() {

  }

  public init(): void {
    SC.initialize({
      client_id: "152f0d7acb02ac226e43133ece32b7ac"
    });
  }

  public getFirstTracks(value: any): any {
    return SC.get("/tracks", {
      q: value,
      streamable: true,
      limit: 30
    })
  }

}

