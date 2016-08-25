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
var common_1 = require('@angular/common');
var animation_1 = require('../../animations/animation');
var backdrop_1 = require('../backdrop/backdrop');
var config_1 = require('../../config/config');
var util_1 = require('../../util/util');
var nav_params_1 = require('../nav/nav-params');
var spinner_1 = require('../spinner/spinner');
var transition_1 = require('../../transitions/transition');
var view_controller_1 = require('../nav/view-controller');
/**
* @private
*/
var LoadingCmp = (function () {
    function LoadingCmp(_viewCtrl, _config, _elementRef, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        this._elementRef = _elementRef;
        this.d = params.data;
        if (this.d.cssClass) {
            renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
        }
        this.id = (++loadingIds);
    }
    LoadingCmp.prototype.ngOnInit = function () {
        // If no spinner was passed in loading options we need to fall back
        // to the loadingSpinner in the app's config, then the mode spinner
        if (util_1.isUndefined(this.d.spinner)) {
            this.d.spinner = this._config.get('loadingSpinner', this._config.get('spinner', 'ios'));
        }
        // If the user passed hide to the spinner we don't want to show it
        this.showSpinner = util_1.isDefined(this.d.spinner) && this.d.spinner !== 'hide';
    };
    LoadingCmp.prototype.ionViewDidEnter = function () {
        var _this = this;
        var activeElement = document.activeElement;
        if (document.activeElement) {
            activeElement.blur();
        }
        // If there is a duration, dismiss after that amount of time
        this.d.duration ? this.durationTimeout = setTimeout(function () { return _this.dismiss('backdrop'); }, this.d.duration) : null;
    };
    LoadingCmp.prototype.dismiss = function (role) {
        if (this.durationTimeout) {
            clearTimeout(this.durationTimeout);
        }
        return this._viewCtrl.dismiss(null, role);
    };
    LoadingCmp = __decorate([
        core_1.Component({
            selector: 'ion-loading',
            template: "\n    <ion-backdrop [class.hide-backdrop]=\"!d.showBackdrop\"></ion-backdrop>\n    <div class=\"loading-wrapper\">\n      <div *ngIf=\"showSpinner\" class=\"loading-spinner\">\n        <ion-spinner [name]=\"d.spinner\"></ion-spinner>\n      </div>\n      <div *ngIf=\"d.content\" [innerHTML]=\"d.content\" class=\"loading-content\"></div>\n    </div>\n  ",
            directives: [backdrop_1.Backdrop, common_1.NgIf, spinner_1.Spinner],
            host: {
                'role': 'dialog'
            },
            encapsulation: core_1.ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, config_1.Config, core_1.ElementRef, nav_params_1.NavParams, core_1.Renderer])
    ], LoadingCmp);
    return LoadingCmp;
}());
exports.LoadingCmp = LoadingCmp;
/**
 * Animations for loading
 */
var LoadingPopIn = (function (_super) {
    __extends(LoadingPopIn, _super);
    function LoadingPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.3);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingPopIn;
}(transition_1.Transition));
transition_1.Transition.register('loading-pop-in', LoadingPopIn);
var LoadingPopOut = (function (_super) {
    __extends(LoadingPopOut, _super);
    function LoadingPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.3, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingPopOut;
}(transition_1.Transition));
transition_1.Transition.register('loading-pop-out', LoadingPopOut);
var LoadingMdPopIn = (function (_super) {
    __extends(LoadingMdPopIn, _super);
    function LoadingMdPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingMdPopIn;
}(transition_1.Transition));
transition_1.Transition.register('loading-md-pop-in', LoadingMdPopIn);
var LoadingMdPopOut = (function (_super) {
    __extends(LoadingMdPopOut, _super);
    function LoadingMdPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingMdPopOut;
}(transition_1.Transition));
transition_1.Transition.register('loading-md-pop-out', LoadingMdPopOut);
var LoadingWpPopIn = (function (_super) {
    __extends(LoadingWpPopIn, _super);
    function LoadingWpPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.3, 1);
        backdrop.fromTo('opacity', 0.01, 0.16);
        this
            .easing('cubic-bezier(0,0 0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingWpPopIn;
}(transition_1.Transition));
transition_1.Transition.register('loading-wp-pop-in', LoadingWpPopIn);
var LoadingWpPopOut = (function (_super) {
    __extends(LoadingWpPopOut, _super);
    function LoadingWpPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.loading-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 1.3);
        backdrop.fromTo('opacity', 0.16, 0);
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    }
    return LoadingWpPopOut;
}(transition_1.Transition));
transition_1.Transition.register('loading-wp-pop-out', LoadingWpPopOut);
var loadingIds = -1;
