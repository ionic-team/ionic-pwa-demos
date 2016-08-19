"use strict";
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var core_1 = require('@angular/core');
var app_1 = require('../components/app/app');
var dom_1 = require('../util/dom');
var providers_1 = require('./providers');
var platform_1 = require('../platform/platform');
var tap_click_1 = require('../components/tap-click/tap-click');
var _reflect = Reflect;
/**
 * @name ionicBootstrap
 * @description
 * `ionicBootstrap` allows you to bootstrap your entire application. Similar to Angular's `bootstrap`, `ionicBootstrap`
 * takes a root component in order to start the app. You can pass along any providers that you may want to inject into your
 * app as an array for the second argument. You can also pass a config object as the third argument to configure your app's settings.
 *
 * @usage
 *
 * ```ts
 * import { ionicBootstrap } from 'ionic-angular';
 * import { Component } from '@angular/core';
 *
 * @Component({
 *   templateUrl: 'build/app.html',
 * })
 * export class MyClass{}
 *
 * ionicBootstrap(MyClass, null, {tabsPlacement: 'bottom'})
 * ```
 */
function ionicBootstrap(appRootComponent, customProviders, config) {
    // get all Ionic Providers
    var providers = providers_1.ionicProviders(customProviders, config);
    providers.push({ provide: app_1.UserComponent, useValue: appRootComponent });
    return new Promise(function (resolve) {
        cssReady(function () {
            // call angular bootstrap
            platform_browser_dynamic_1.bootstrap(app_1.AppRoot, providers).then(function (ngComponentRef) {
                // ionic app has finished bootstrapping
                ionicPostBootstrap(ngComponentRef);
                resolve(ngComponentRef);
            });
        });
    });
}
exports.ionicBootstrap = ionicBootstrap;
/**
 * @private
 */
function ionicPostBootstrap(ngComponentRef) {
    // prepare platform ready
    var platform = ngComponentRef.injector.get(platform_1.Platform);
    platform.setZone(ngComponentRef.injector.get(core_1.NgZone));
    platform.prepareReady();
    ngComponentRef.injector.get(tap_click_1.TapClick);
    return ngComponentRef;
}
exports.ionicPostBootstrap = ionicPostBootstrap;
var cssLoadAttempt = 0;
function cssReady(done) {
    var appEle = document.body.querySelector('ion-app');
    if (!appEle || appEle.clientHeight > 0 || cssLoadAttempt > 300) {
        done();
    }
    else {
        dom_1.nativeRaf(function () {
            cssLoadAttempt++;
            cssReady(done);
        });
    }
}
/**
 * @private
 */
function addSelector(type, selector) {
    if (type) {
        var annotations = _reflect.getMetadata('annotations', type);
        if (annotations && !annotations[0].selector) {
            annotations[0].selector = selector;
            _reflect.defineMetadata('annotations', annotations, type);
        }
    }
}
exports.addSelector = addSelector;
