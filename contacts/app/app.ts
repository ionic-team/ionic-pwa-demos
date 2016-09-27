import { Component } from '@angular/core';
import { ionicBootstrap, Platform, MenuController } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { ContactListPage } from './pages/contact-list/contact-list';

import { ContactData } from './providers/contact-data';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
class MyApp {
  rootPage: any = ContactListPage;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp, [ContactData]);
