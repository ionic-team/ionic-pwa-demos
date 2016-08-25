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
var core_1 = require('@angular/core');
var app_1 = require('../app/app');
var util_1 = require('../../util/util');
var popover_component_1 = require('./popover-component');
var view_controller_1 = require('../nav/view-controller');
/**
 * @private
 */
var Popover = (function (_super) {
    __extends(Popover, _super);
    function Popover(app, componentType, data, opts) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        opts.showBackdrop = util_1.isPresent(opts.showBackdrop) ? !!opts.showBackdrop : true;
        opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        data.componentType = componentType;
        data.opts = opts;
        _super.call(this, popover_component_1.PopoverCmp, data);
        this._app = app;
        this.isOverlay = true;
        // by default, popovers should not fire lifecycle events of other views
        // for example, when a popover enters, the current active view should
        // not fire its lifecycle events because it's not conceptually leaving
        this.fireOtherLifecycles = false;
    }
    /**
     * @private
     */
    Popover.prototype.getTransitionName = function (direction) {
        var key = (direction === 'back' ? 'popoverLeave' : 'popoverEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * Present the popover instance.
     *
     * @param {NavOptions} [opts={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    Popover.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        return this._app.present(this, navOptions);
    };
    /**
     * @private
     * DEPRECATED: Please inject PopoverController instead
     */
    Popover.create = function (componentType, data, opts) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        // deprecated warning: added beta.11 2016-06-27
        void 0;
    };
    return Popover;
}(view_controller_1.ViewController));
exports.Popover = Popover;
/**
 * @name PopoverController
 * @description
 * A Popover is a dialog that appears on top of the current page.
 * It can be used for anything, but generally it is used for overflow
 * actions that don't fit in the navigation bar.
 *
 * ### Creating
 * A popover can be created by calling the `create` method. The view
 * to display in the popover should be passed as the first argument.
 * Any data to pass to the popover view can optionally be passed in
 * the second argument. Options for the popover can optionally be
 * passed in the third argument. See the [create](#create) method
 * below for all available options.
 *
 * ### Presenting
 * To present a popover, call the `present` method on the [NavController](../../nav/NavController).
 * The first argument passed to the `present` should be the popover. In order
 * to position the popover relative to the element clicked, the event needs to be
 * passed as the second argument. If the event is not passed, the popover will be
 * positioned in the center of the current view. See the [usage](#usage) section for
 * an example of passing this event.
 *
 * ### Dismissing
 * To dismiss the popover after creation, call the `dismiss()` method on the
 * `Popover` instance. The popover can also be dismissed from within the popover's
 * view by calling the `dismiss()` method on the [ViewController](../../nav/ViewController).
 * The `onDidDismiss` function can be called to perform an action after the popover
 * is dismissed. The popover will dismiss when the backdrop is clicked, but this
 * can be disabled by setting `enableBackdropDismiss` to `false` in the popover
 * options.
 *
 * > Note that after the component is dismissed, it will not be usable anymore and
 * another one must be created. This can be avoided by wrapping the creation and
 * presentation of the component in a reusable function as shown in the [usage](#usage)
 * section below.
 *
 * @usage
 *
 * To open a popover on the click of a button, pass `$event` to the method
 * which creates and presents the popover:
 *
 * ```html
 * <button (click)="presentPopover($event)">
 *   <ion-icon name="more"></ion-icon>
 * </button>
 * ```
 *
 * ```ts
 * @Component({})
 * class MyPage {
 *   constructor(private popoverCtrl: PopoverController) {}
 *
 *   presentPopover(myEvent) {
 *     let popover = this.popoverCtrl.create(PopoverPage);
 *     popover.present({
 *       ev: myEvent
 *     });
 *   }
 * }
 * ```
 *
 * The `PopoverPage` will display inside of the popover, and
 * can be anything. Below is an example of a page with items
 * that close the popover on click.
 *
 * ```ts
 * @Component({
 *   template: `
 *     <ion-list>
 *       <ion-list-header>Ionic</ion-list-header>
 *       <button ion-item (click)="close()">Learn Ionic</button>
 *       <button ion-item (click)="close()">Documentation</button>
 *       <button ion-item (click)="close()">Showcase</button>
 *       <button ion-item (click)="close()">GitHub Repo</button>
 *     </ion-list>
 *   `
 * })
 * class PopoverPage {
 *   constructor(private viewCtrl: ViewController) {}
 *
 *   close() {
 *     this.viewCtrl.dismiss();
 *   }
 * }
 * ```
 * @advanced
 * Popover Options
 *
 * | Option                | Type       | Description                                                                                                      |
 * |-----------------------|------------|------------------------------------------------------------------------------------------------------------------|
 * | cssClass              |`string`    | An additional class for custom styles.                                                                           |
 * | showBackdrop          |`boolean`   | Whether to show the backdrop. Default true.                                                                      |
 * | enableBackdropDismiss |`boolean`   | Whether the popover should be dismissed by tapping the backdrop. Default true.                                   |
 *
 *
 *
 * @demo /docs/v2/demos/popover/
 */
var PopoverController = (function () {
    function PopoverController(_app) {
        this._app = _app;
    }
    /**
     * Present a popover. See below for options
     * @param {object} componentType The Popover
     * @param {object} data Any data to pass to the Popover view
     * @param {PopoverOptions} opts Popover options
     */
    PopoverController.prototype.create = function (componentType, data, opts) {
        if (data === void 0) { data = {}; }
        if (opts === void 0) { opts = {}; }
        return new Popover(this._app, componentType, data, opts);
    };
    PopoverController = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [app_1.App])
    ], PopoverController);
    return PopoverController;
}());
exports.PopoverController = PopoverController;
