import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Notify } from '@ngrx/notify';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';

import { Chat } from '../../providers/chat/chat';

@Component({
  templateUrl: 'build/pages/page2/page2.html'
})
export class Page2 {

  notifyPerm: string;

  constructor(
    private navCtrl: NavController,
    private notify: Notify,
    private toastCtrl: ToastController,
    private chatProvider: Chat) {

  }

  ionViewDidEnter() {
    if (localStorage.getItem('notify') === 'true') {
      this.notifyPerm = 'Allowed';
    } else {
      this.notifyPerm = 'Blocked';
    }
  }

  noVibrate(value: boolean) {
    console.log(value);
    if (value === true) {
      localStorage.setItem('vibrate', 'true');
    } else {
      localStorage.setItem('vibrate', 'false');
    }
  }

  share() {
    window.open(`http://twitter.com/share?text=Check chat with me on AnonChat!&url=https://anon-chat.herokuapp.com&hashtags=AnonChat`);
  }

}
