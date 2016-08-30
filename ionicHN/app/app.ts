import { Component, ViewChild, enableProdMode } from '@angular/core';
import { Http } from '@angular/http';
import { Platform, ionicBootstrap, Nav } from 'ionic-angular';
import { StatusBar } from 'ionic-native';

import { HomePage } from './pages/home/home';
import { AboutPage } from './pages/about/about';
import { AskStoriesPage } from './pages/ask-stories/ask-stories';
import { ShowStoriesPage } from './pages/show-stories/show-stories';

enableProdMode();

@Component({
  templateUrl: 'build/app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  private rootPage: any = HomePage;
  pages: Array<{ title: string, component: any }>;

  constructor(private platform: Platform) {

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Top Stories', component: HomePage },
      { title: 'Ask Stories', component: AskStoriesPage },
      { title: 'Show Stories', component: ShowStoriesPage },
      { title: 'Jobs', component: AboutPage }
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(page: any) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

}

ionicBootstrap(MyApp);
