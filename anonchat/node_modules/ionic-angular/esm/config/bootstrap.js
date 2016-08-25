import { bootstrap } from '@angular/platform-browser-dynamic';
import { NgZone } from '@angular/core';
import { AppRoot, UserComponent } from '../components/app/app';
import { nativeRaf } from '../util/dom';
import { ionicProviders } from './providers';
import { Platform } from '../platform/platform';
import { TapClick } from '../components/tap-click/tap-click';
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
export function ionicBootstrap(appRootComponent, customProviders, config) {
    // get all Ionic Providers
    var providers = ionicProviders(customProviders, config);
    providers.push({ provide: UserComponent, useValue: appRootComponent });
    return new Promise(function (resolve) {
        cssReady(function () {
            // call angular bootstrap
            bootstrap(AppRoot, providers).then(function (ngComponentRef) {
                // ionic app has finished bootstrapping
                ionicPostBootstrap(ngComponentRef);
                resolve(ngComponentRef);
            });
        });
    });
}
/**
 * @private
 */
export function ionicPostBootstrap(ngComponentRef) {
    // prepare platform ready
    var platform = ngComponentRef.injector.get(Platform);
    platform.setZone(ngComponentRef.injector.get(NgZone));
    platform.prepareReady();
    ngComponentRef.injector.get(TapClick);
    return ngComponentRef;
}
var cssLoadAttempt = 0;
function cssReady(done) {
    var appEle = document.body.querySelector('ion-app');
    if (!appEle || appEle.clientHeight > 0 || cssLoadAttempt > 300) {
        done();
    } else {
        nativeRaf(function () {
            cssLoadAttempt++;
            cssReady(done);
        });
    }
}
/**
 * @private
 */
export function addSelector(type, selector) {
    if (type) {
        var annotations = _reflect.getMetadata('annotations', type);
        if (annotations && !annotations[0].selector) {
            annotations[0].selector = selector;
            _reflect.defineMetadata('annotations', annotations, type);
        }
    }
}