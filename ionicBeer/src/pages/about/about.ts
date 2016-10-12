import { Component } from '@angular/core';

import { NavController, ToastController, LoadingController } from 'ionic-angular';

import { BeerService } from '../../providers/beer.service';
import { DetailPage } from '../detail/detail';

@Component({
  templateUrl: 'about.html'
})
export class AboutPage {

  public bars: any;

  constructor(
    public navCtrl: NavController,
    public beerService: BeerService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {

  }

  ionViewDidEnter() {
    let loader = this.loadingCtrl.create({
      content: 'Fetching bars near you...'
    });
    loader.present().then(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        this.beerService.getLocalBeer(position).subscribe(
          data => {
            let barData = JSON.parse(data);
            this.bars = barData.data;
            console.log(barData);
            loader.dismiss();
          },
          err => {
            console.error(err);
            loader.dismiss().then(() => {
              let toast = this.toastCtrl.create({
                message: 'Could not fetch bars',
                duration: 2000
              });
              toast.present();
            });
          }
        );
      });
    });
  }

  openDetail(bar) {
    this.navCtrl.push(DetailPage, { data: bar })
  }
}
