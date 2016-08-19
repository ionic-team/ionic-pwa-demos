import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';

import { AngularFire } from 'angularfire2';
import { Page1 } from '../page1/page1';


/*
  Generated class for the LoginPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  templateUrl: 'build/pages/login/login.html',
})
export class LoginPage {

  constructor(
    private navCtrl: NavController,
    private af: AngularFire,
    private toastCtrl: ToastController) {}

  ionViewDidEnter() {
    this.af.auth.subscribe(
      auth => {
        sessionStorage.setItem('userPic', auth.auth.photoURL);
        sessionStorage.setItem('userEmail', auth.auth.email);
        this.navCtrl.setRoot(Page1, {}, {
          animate: true
        });
      },
      err => {
        let toast = this.toastCtrl.create({
          message: 'There was an error logging in, please try again',
          duration: 2000
        });
        toast.present();
      }
    );
  }

  login() {
    this.af.auth.login();
  }

}
