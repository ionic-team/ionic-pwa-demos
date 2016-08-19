import { Component, enableProdMode } from '@angular/core';
import { ionicBootstrap, Platform } from 'ionic-angular';

enableProdMode();

import {
  FIREBASE_PROVIDERS,
  defaultFirebase,
  firebaseAuthConfig,
  AuthProviders,
  AuthMethods } from 'angularfire2';

import { LoginPage } from './pages/login/login';

@Component({
  templateUrl: 'build/app.html'
})
class MyApp {

  rootPage: any = LoginPage;

  constructor(public platform: Platform) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

    });
  }
}

ionicBootstrap(MyApp, [
  FIREBASE_PROVIDERS,
  defaultFirebase({
    apiKey: 'AIzaSyB_r5i2UeGtPIA-K7OljYRod8Gwn2eYs9g',
    authDomain: 'trio-b3927.firebaseapp.com',
    databaseURL: 'https://trio-b3927.firebaseio.com',
    storageBucket: 'trio-b3927.appspot.com'
  }),
  firebaseAuthConfig({
    provider: AuthProviders.Google,
    method: AuthMethods.Redirect
  })
]);
