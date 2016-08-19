import {Component} from "@angular/core";
import {enableDebugTools} from "@angular/platform-browser";
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from "./pages/tabs/tabs";

import {enableProdMode} from '@angular/core'
import 'rxjs/Rx';

enableProdMode();

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //StatusBar.backgroundColorByHexString("#1976D2");
    });
  }
}

ionicBootstrap(MyApp, [], {
  tabsPlacement: 'top',
  tabsHideOnSubPages: true,
  tabsHighlight: true
});