import { Component } from '@angular/core';
import { Config, NavController, NavParams } from 'ionic-angular';
import { ContactDetailsPage } from '../contact-details/contact-details';

import { ContactData } from '../../providers/contact-data';


@Component({
  templateUrl: 'build/pages/contact-list/contact-list.html'
})
export class ContactListPage {
  contacts: any;
  isMd: boolean;

  constructor(public config: Config, public navCtrl: NavController, navParams: NavParams, contactData: ContactData) {
    this.isMd = config.get('mode') === 'md';
    contactData.load().then((data) => {
      this.contacts = data;
      console.log(this.contacts);
    });
  }

  contactTapped(event, contact) {
    this.navCtrl.push(ContactDetailsPage, {
      contact: contact
    });
  }
}
