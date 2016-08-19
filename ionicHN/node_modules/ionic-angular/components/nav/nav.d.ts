import { AfterViewInit, ComponentResolver, ElementRef, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { Keyboard } from '../../util/keyboard';
import { GestureController } from '../../gestures/gesture-controller';
import { NavControllerBase } from './nav-controller-base';
import { ViewController } from './view-controller';
/**
 * @name Nav
 * @description
 *
 * `ion-nav` is the declarative component for a [NavController](../NavController/).
 *
 * For more information on using nav controllers like Nav or [Tab](../../Tabs/Tab/),
 * take a look at the [NavController API Docs](../NavController/).
 *
 *
 * @usage
 * You must set a root page to be loaded initially by any Nav you create, using
 * the 'root' property:
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { ionicBootstrap } from 'ionic-angular';
 * import { GettingStartedPage } from './getting-started';
 *
 * @Component({
 *   template: `<ion-nav [root]="root"></ion-nav>`
 * })
 * class MyApp {
 *   private root: any = GettingStartedPage;
 *
 *   constructor(){
 *   }
 * }
 *
 * ionicBootstrap(MyApp);
 * ```
 *
 *
 * @demo /docs/v2/demos/navigation/
 * @see {@link /docs/v2/components#navigation Navigation Component Docs}
 */
export declare class Nav extends NavControllerBase implements AfterViewInit {
    private _root;
    private _hasInit;
    constructor(viewCtrl: ViewController, parent: NavControllerBase, app: App, config: Config, keyboard: Keyboard, elementRef: ElementRef, zone: NgZone, renderer: Renderer, compiler: ComponentResolver, gestureCtrl: GestureController);
    /**
     * @private
     */
    _vp: ViewContainerRef;
    /**
     * @private
     */
    ngAfterViewInit(): void;
    /**
     * @input {Page} The Page component to load as the root page within this nav.
     */
    root: any;
    /**
     * @input {boolean} Whether it's possible to swipe-to-go-back on this nav controller or not.
     */
    swipeBackEnabled: boolean;
}
