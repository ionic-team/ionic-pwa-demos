import { Component } from '@angular/core';
import { NavController, AlertController, ToastController } from 'ionic-angular';

import { TabsPage } from '../../pages/tabs/tabs';
import { Creds } from '../../providers/creds/creds';

/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
  providers: [Creds]
})
export class LoginPage {

  loaded: boolean;

  constructor(
    private navCtrl: NavController,
    private creds: Creds,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
    this.loaded = false;
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.loaded = true;
    }, 300);
  }

  login() {
    if (localStorage.getItem('chattyUsername') === null) {
      this.creds.login().then((name) => {
        let toast = this.toastCtrl.create({
          message: `Hello ${name}!`,
          duration: 2000
        });
        toast.present();
        toast.onDidDismiss(() => {
          this.navCtrl.setRoot(TabsPage);
        });
      }).catch((e) => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'There was an error logging in, please try to login again.',
          buttons: [
            'OK'
          ]
        });
        alert.present();
      });
    } else {
      let name = localStorage.getItem('chattyUsername');
      let toast = this.toastCtrl.create({
        message: `Welcome back ${name}!`,
        duration: 2000
      });
      toast.present();
      toast.onDidDismiss(() => {
        this.navCtrl.setRoot(TabsPage);
      });
    }
  }

}
