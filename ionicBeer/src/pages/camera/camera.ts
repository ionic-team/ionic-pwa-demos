import { Component, ViewChild, ElementRef } from '@angular/core';
import {
  NavController,
  ViewController,
  LoadingController,
  ToastController,
  AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { BeerService } from '../../providers/beer.service';
import { DetailPage } from '../detail/detail';

/*
  Generated class for the Camera page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class Camera {

  @ViewChild('imageElement') imageElement: ElementRef;
  pictureFile: any;
  noSearch: boolean;
  beers: any[];
  faveBeers: any[];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public beerService: BeerService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public storage: Storage) {
      this.storage.get('faveBeers').then((value) => {
      console.log(value);
      if (value === null) {
        this.faveBeers = [];
      } else {
        this.faveBeers = value;
      }
    })
  }

  ionViewDidEnter() {
    if (this.noSearch === undefined) {
      this.noSearch = true;
    }
  }

  pictureTaken(e: any) {
    let files = e.target.files;
    if (files && files.length > 0) {
      this.pictureFile = files[0];
      let image = window.URL.createObjectURL(this.pictureFile);
      this.imageElement.nativeElement.src = image;
    }
  }

  search() {
    let loader = this.loadingCtrl.create({
      content: 'Uploading...'
    });
    loader.present().then(() => {
      const formData = new FormData();
      formData.append('fileToUpload', this.pictureFile, this.pictureFile.name);
      this.beerService.pictureSearch(formData).subscribe(data => {
        console.log(data);
        loader.dismiss().then(() => {
          this.noSearch = false;
          this.beerService.searchBeers(data[1]).subscribe(data => {
            let beerData = JSON.parse(data);
            this.beers = beerData.data;
          }, err => {
            let toast = this.toastCtrl.create({
              message: 'No beers found...',
              duration: 2000
            });
            toast.present();
            console.error(err);
          })
        })
      }, err => {
        console.error(err);
        loader.dismiss();
      })
    });
  }

  openDetail(beer: Object) {
    this.navCtrl.push(DetailPage, { data: beer });
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

  done() {
    this.noSearch = true;
  }

  close() {
    this.viewCtrl.dismiss();
  }
}
