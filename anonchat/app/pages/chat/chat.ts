import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Notify } from '@ngrx/notify';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/take';

import { Creds } from '../../providers/creds/creds';
import { Analysis } from '../../providers/analysis/analysis';

/*
  Generated class for the ChatPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/chat/chat.html',
  providers: [Creds, Analysis]
})
export class ChatPage {

  socket: any;
  name: string;
  chats: any[];
  username: string;
  color: string;

  constructor(
    private navCtrl: NavController,
    private params: NavParams,
    private creds: Creds,
    private analysis: Analysis,
    private alertCtrl: AlertController,
    private notify: Notify) {
    this.chats = [];
  }

  ionViewLoaded() {
    this.socket = this.params.get('data');
    this.name = this.params.get('name');
  }

  ionViewDidEnter() {

    this.creds.get_username().then((name) => {
      this.username = name;
    }).catch((e) => {
      let alert = this.alertCtrl.create({
        title: 'Error',
        message: 'There was an error, please try again',
        buttons: [
          {
            text: 'Ok',
            role: 'cancel',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      alert.present();
    });

    this.randomColor();

    // receive messages
    this.socket.on('message received', (data) => {
      console.log(data);
      let localMessage: boolean;
      if (data.username === this.username) {
        localMessage = true;
      } else {
        localMessage = false;
        if (localStorage.getItem('vibrate') === 'true') {
          navigator.vibrate(300);
        }
      }

      this.chats.push({ username: data.username, message: data.message, color: data.color, type: localMessage });
    });
  }

  sendChat(message: HTMLInputElement) {
    console.log(message);
    this.socket.emit('new message', { username: this.username, message: message.value, color: this.color });
    message.value = '';
  }

  randomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    this.color = color;
  }

}
