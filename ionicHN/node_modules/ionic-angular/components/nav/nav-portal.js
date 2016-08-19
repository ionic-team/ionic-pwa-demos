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
var gesture_controller_1 = require('../../gestures/gesture-controller');
var keyboard_1 = require('../../util/keyboard');
var nav_controller_base_1 = require('../nav/nav-controller-base');
/**
 * @private
 */
var NavPortal = (function (_super) {
    __extends(NavPortal, _super);
    function NavPortal(app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl, viewPort) {
        _super.call(this, null, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl);
        this._isPortal = true;
        this._init = true;
        this.setViewport(viewPort);
        app.setPortal(this);
        // on every page change make sure the portal has
        // dismissed any views that should be auto dismissed on page change
        app.viewDidLeave.subscribe(this.dismissPageChangeViews.bind(this));
    }
    NavPortal = __decorate([
        core_1.Directive({
            selector: '[nav-portal]'
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return app_1.App; }))), 
        __metadata('design:paramtypes', [app_1.App, config_1.Config, keyboard_1.Keyboard, core_1.ElementRef, core_1.NgZone, core_1.Renderer, core_1.ComponentResolver, gesture_controller_1.GestureController, core_1.ViewContainerRef])
    ], NavPortal);
    return NavPortal;
}(nav_controller_base_1.NavControllerBase));
exports.NavPortal = NavPortal;
