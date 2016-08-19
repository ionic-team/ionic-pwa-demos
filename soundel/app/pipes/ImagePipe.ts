import {Injectable, Pipe} from '@angular/core';

/*
  Generated class for the ImagePipe pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
  name: 'image'
})
@Injectable()
export class ImagePipe {
  transform(value: string, args: any[]) {
    const fixedString = value.replace("large", "t500x500");
    return fixedString;
  }
}
