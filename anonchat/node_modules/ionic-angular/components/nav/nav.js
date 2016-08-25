"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var app_1 = require('../app/app');
var config_1 = require('../../config/config');
var keyboard_1 = require('../../util/keyboard');
var gesture_controller_1 = require('../../gestures/gesture-controller');
var util_1 = require('../../util/util');
var nav_controller_base_1 = require('./nav-controller-base');
var view_controller_1 = require('./view-controller');
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
var Nav = (function (_super) {
    __extends(Nav, _super);
    function Nav(viewCtrl, parent, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl) {
        _super.call(this, parent, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl);
        this._hasInit = false;
        if (viewCtrl) {
            // an ion-nav can also act as an ion-page within a parent ion-nav
            // this would happen when an ion-nav nests a child ion-nav.
            viewCtrl.setContent(this);
            viewCtrl.setContentRef(elementRef);
        }
        if (parent) {
            // this Nav has a parent Nav
            parent.registerChildNav(this);
        }
        else if (viewCtrl && viewCtrl.getNav()) {
            // this Nav was opened from a modal
            this.parent = viewCtrl.getNav();
            this.parent.registerChildNav(this);
        }
        else if (app && !app.getRootNav()) {
            // a root nav has not been registered yet with the app
            // this is the root navcontroller for the entire app
            app.setRootNav(this);
        }
    }
    Object.defineProperty(Nav.prototype, "_vp", {
        /**
         * @private
         */
        set: function (val) {
            this.setViewport(val);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    Nav.prototype.ngAfterViewInit = function () {
        this._hasInit = true;
        if (this._root) {
            this.push(this._root);
        }
    };
    Object.defineProperty(Nav.prototype, "root", {
        /**
         * @input {Page} The Page component to load as the root page within this nav.
         */
        get: function () {
            return this._root;
        },
        set: function (page) {
            this._root = page;
            if (this._hasInit) {
                this.setRoot(page);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Nav.prototype, "swipeBackEnabled", {
        /**
         * @input {boolean} Whether it's possible to swipe-to-go-back on this nav controller or not.
         */
        get: function () {
            return this._sbEnabled;
        },
        set: function (val) {
            this._sbEnabled = util_1.isTrueProperty(val);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.ViewChild('viewport', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef])
    ], Nav.prototype, "_vp", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Nav.prototype, "root", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Nav.prototype, "swipeBackEnabled", null);
    Nav = __decorate([
        core_1.Component({
            selector: 'ion-nav',
            template: "\n    <div #viewport nav-viewport></div>\n    <div class=\"nav-decor\"></div>\n  ",
            encapsulation: core_1.ViewEncapsulation.None,
        }),
        __param(0, core_1.Optional()),
        __param(1, core_1.Optional()), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, nav_controller_base_1.NavControllerBase, app_1.App, config_1.Config, keyboard_1.Keyboard, core_1.ElementRef, core_1.NgZone, core_1.Renderer, core_1.ComponentResolver, gesture_controller_1.GestureController])
    ], Nav);
    return Nav;
}(nav_controller_base_1.NavControllerBase));
exports.Nav = Nav;
