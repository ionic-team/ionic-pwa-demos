import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  template: `
    <ion-content>
      <p style="margin-left: 2rem;">Beerly is proudly built with Ionic 2!</p>
    </ion-content>
  `
})
export class PopoverPage {
  constructor(private navCtrl: NavController) {

  }
}