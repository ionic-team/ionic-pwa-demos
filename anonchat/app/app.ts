import { Component, ViewChild, enableProdMode } from '@angular/core';
import { Http } from '@angular/http';
import { ionicBootstrap, Platform, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';
import { NOTIFY_PROVIDERS } from '@ngrx/notify';

import { Page1 } from './pages/page1/page1';
import { Page2 } from './pages/page2/page2';
import { LoginPage } from './pages/login/login';
import { Chat } from './providers/chat/chat';

enableProdMode();

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{ title: string, component: any }>;

  constructor(private platform: Platform) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Chat Rooms', component: Page1 },
      { title: 'Settings', component: Page2 }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

ionicBootstrap(MyApp, [
  Chat,
  NOTIFY_PROVIDERS
], {
    tabsPlacement: 'top',
    tabsHideOnSubPages: true,
    tabsHighlight: true,

    platforms: {
      ios: {
        tabsPlacement: 'bottom',
        tabsHideOnSubPages: false,
        tabsHighlight: false
      }
    }
  });
