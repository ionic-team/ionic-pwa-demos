import { Component } from '@angular/core';
import { NavController,
  NavParams } from 'ionic-angular';


@Component({
  templateUrl: 'build/pages/contact-details/contact-details.html'
})
export class ContactDetailsPage {
  contact: any;

  constructor(public navCtrl: NavController,
  navParams: NavParams) {
    this.contact = navParams.get('contact');
  }
};
