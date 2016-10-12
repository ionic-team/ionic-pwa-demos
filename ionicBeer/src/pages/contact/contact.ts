import { Component } from '@angular/core';

import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BeerService } from '../../providers/beer.service';
import { DetailPage } from '../detail/detail';

@Component({
  templateUrl: 'contact.html'
})
export class ContactPage {

  public beers: any[];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    public beerService: BeerService) {

  }

  ionViewDidEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Fetching beer...'
    });
    loader.present().then(() => {
      this.storage.get('faveBeers').then((data) => {
        this.beers = data;
        loader.dismiss();
      }).catch((err) => {
        console.error(err);
        loader.dismiss();
      })
    });
  }

  openDetail(beer: Object) {
    this.navCtrl.push(DetailPage, { data: beer });
  }

  clear() {
    let confirm = this.alertCtrl.create({
      title: 'Clear favorites?',
      message: 'Are you sure you want to clear your favorites?',
      buttons: [
        {
          text: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Sure',
          handler: () => {
            this.beers = [];
            this.storage.set('faveBeers', this.beers);
          }
        }
      ]
    });
    confirm.present();
  }
}
