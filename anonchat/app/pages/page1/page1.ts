import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { Chat } from '../../providers/chat/chat';
import { ChatPage } from '../chat/chat';
import { NewRoomPage } from '../new-room/new-room';

@Component({
  templateUrl: 'build/pages/page1/page1.html'
})
export class Page1 {

  rooms: any[];
  defaultImage = 'https://www.placecage.com/1000/1000';

  constructor(
    private navCtrl: NavController,
    private chatProvider: Chat,
    private modalCtrl: ModalController
  ) {
  }

  ionViewLoaded() {
    this.chatProvider.postServerKey().subscribe(
      data => {
        console.log(data);
      }
    );
  }

  ionViewDidEnter() {
    this.chatProvider.retrieveRooms().subscribe(
      data => {
        console.log(data);
        this.rooms = JSON.parse(data._body);
      },
      err => console.error(err)
    );
  }

  startChatting(name: string) {
    let socket = this.chatProvider.init_chat(name);
    this.navCtrl.push(ChatPage, { name: name, data: socket });
  }

  newRoom() {
    let modal = this.modalCtrl.create(NewRoomPage);
    modal.present();
  }

}
