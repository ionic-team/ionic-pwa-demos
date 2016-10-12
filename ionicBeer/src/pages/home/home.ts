import { Component } from '@angular/core';

import {
  NavController,
  LoadingController,
  AlertController,
  ToastController,
  PopoverController,
  FabContainer,
  ModalController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BeerService } from '../../providers/beer.service';
import { DetailPage } from '../detail/detail';
import { PopoverPage } from '../PopoverPage/popover-page';
import { Camera } from '../camera/camera';

@Component({
  templateUrl: 'home.html'
})
export class HomePage {

  public beers: any[];
  public faveBeers: any[];

  constructor(
    private navCtrl: NavController,
    public beerService: BeerService,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public popoverCtrl: PopoverController,
    public storage: Storage,
    public modalCtrl: ModalController
  ) {
    this.storage.get('faveBeers').then((value) => {
      console.log(value);
      if (value === null) {
        this.faveBeers = [];
      } else {
        this.faveBeers = value;
      }
    })
  }

  ionViewDidLoad() {
    let loader = this.loadingCtrl.create({
      content: 'Fetching beer...'
    });
    loader.present().then(() => {
      this.beerService.getBeerList().subscribe(
        data => {
          let beerData = JSON.parse(data);
          this.beers = beerData.data;
          loader.dismiss();
        },
        err => {
          console.error(err);
        }
      )
    });
  }

  openDetail(beer: Object) {
    this.navCtrl.push(DetailPage, { data: beer });
  }

  search(fab: FabContainer) {
    fab.close();
    let alert = this.alertCtrl.create({
      title: 'Search',
      message: 'Search beers!',
      inputs: [
        {
          name: 'searchTerm',
          placeholder: 'stout'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {

          }
        },
        {
          text: 'Search',
          handler: data => {
            let loader = this.loadingCtrl.create({
              content: 'Fetching beer...'
            });
            loader.present().then(() => {
              this.beerService.searchBeers(data.searchTerm).subscribe(
                data => {
                  let beerData = JSON.parse(data);
                  this.beers = beerData.data;
                  loader.dismiss();
                },
                err => {
                  let toast = this.toastCtrl.create({
                    message: 'No beers found...',
                    duration: 2000
                  });
                  loader.dismiss().then(() => {
                    toast.present();
                  });
                }
              );
            });
          }
        }
      ]
    });
    alert.present();
  }

  default(fab: FabContainer) {
    fab.close();
    let loader = this.loadingCtrl.create({
      content: 'Fetching default beers...'
    });
    loader.present().then(() => {
      this.beerService.getBeerList().subscribe(
        data => {
          let beerData = JSON.parse(data);
          this.beers = beerData.data;
          loader.dismiss();
        },
        err => {
          console.error(err);
        }
      )
    });
  }

  favorite(beer: any) {
    let prompt = this.alertCtrl.create({
      title: 'Favorite',
      message: "Would you like to favorite this beer?",
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Favorite',
          handler: data => {
            this.faveBeers.push(beer);
            this.storage.set('faveBeers', this.faveBeers);
          }
        }
      ]
    });
    prompt.present();
  }

  more(myEvent: Event) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  image(fab: FabContainer) {
    fab.close();
    let modal = this.modalCtrl.create(Camera);
    modal.present();
  }
}
