import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { Notify } from '@ngrx/notify';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';

import { Chat } from '../../providers/chat/chat';

/*
  Generated class for the NewRoomPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/new-room/new-room.html'
})
export class NewRoomPage {

  constructor(
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private chatService: Chat,
    private notify: Notify) {

  }

  createRoom(name: string, desc: string) {
    this.chatService.newRoom(name, desc).subscribe(
      data => {
        console.log(data._body);
        this.chatService.add_room(data._body, desc);
        this.viewCtrl.dismiss();
        this.notify.open(`New room succesfully made!`)
          .takeUntil(Observable.timer(5000))
          .take(1)
          .subscribe(notification => {

          });
      },
      err => console.error(err)
    );
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
