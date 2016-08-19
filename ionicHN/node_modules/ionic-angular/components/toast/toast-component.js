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
var config_1 = require('../../config/config');
var nav_params_1 = require('../nav/nav-params');
var transition_1 = require('../../transitions/transition');
var view_controller_1 = require('../nav/view-controller');
/**
* @private
*/
var ToastCmp = (function () {
    function ToastCmp(_viewCtrl, _config, _elementRef, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        this._elementRef = _elementRef;
        this.dismissTimeout = undefined;
        this.d = params.data;
        if (this.d.cssClass) {
            renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
        }
        this.id = (++toastIds);
        if (this.d.message) {
            this.hdrId = 'toast-hdr-' + this.id;
        }
    }
    ToastCmp.prototype.ngAfterViewInit = function () {
        var _this = this;
        // if there's a `duration` set, automatically dismiss.
        if (this.d.duration) {
            this.dismissTimeout =
                setTimeout(function () {
                    _this.dismiss('backdrop');
                }, this.d.duration);
        }
        this.enabled = true;
    };
    ToastCmp.prototype.ionViewDidEnter = function () {
        var activeElement = document.activeElement;
        if (activeElement) {
            activeElement.blur();
        }
        var focusableEle = this._elementRef.nativeElement.querySelector('button');
        if (focusableEle) {
            focusableEle.focus();
        }
    };
    ToastCmp.prototype.cbClick = function () {
        if (this.enabled) {
            this.dismiss('close');
        }
    };
    ToastCmp.prototype.dismiss = function (role) {
        clearTimeout(this.dismissTimeout);
        this.dismissTimeout = undefined;
        return this._viewCtrl.dismiss(null, role);
    };
    ToastCmp = __decorate([
        core_1.Component({
            selector: 'ion-toast',
            template: "\n    <div class=\"toast-wrapper\"\n      [class.toast-bottom]=\"d.position === 'bottom'\"\n      [class.toast-middle]=\"d.position === 'middle'\"\n      [class.toast-top]=\"d.position === 'top'\">\n      <div class=\"toast-container\">\n        <div class=\"toast-message\" id=\"{{hdrId}}\" *ngIf=\"d.message\">{{d.message}}</div>\n        <button clear class=\"toast-button\" *ngIf=\"d.showCloseButton\" (click)=\"cbClick()\">\n          {{ d.closeButtonText || 'Close' }}\n         </button>\n      </div>\n    </div>\n  ",
            directives: [common_1.NgIf],
            host: {
                'role': 'dialog',
                '[attr.aria-labelledby]': 'hdrId',
                '[attr.aria-describedby]': 'descId',
            },
        }), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, config_1.Config, core_1.ElementRef, nav_params_1.NavParams, core_1.Renderer])
    ], ToastCmp);
    return ToastCmp;
}());
exports.ToastCmp = ToastCmp;
var ToastSlideIn = (function (_super) {
    __extends(ToastSlideIn, _super);
    function ToastSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        // DOM READS
        var ele = enteringView.pageRef().nativeElement;
        var wrapperEle = ele.querySelector('.toast-wrapper');
        var wrapper = new animation_1.Animation(wrapperEle);
        if (enteringView.data && enteringView.data.position === TOAST_POSITION_TOP) {
            // top
            // by default, it is -100% hidden (above the screen)
            // so move from that to 10px below top: 0px;
            wrapper.fromTo('translateY', '-100%', 10 + "px");
        }
        else if (enteringView.data && enteringView.data.position === TOAST_POSITION_MIDDLE) {
            // Middle
            // just center it and fade it in
            var topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
            // DOM WRITE
            wrapperEle.style.top = topPosition + "px";
            wrapper.fromTo('opacity', 0.01, 1);
        }
        else {
            // bottom
            // by default, it is 100% hidden (below the screen),
            // so move from that to 10 px above bottom: 0px
            wrapper.fromTo('translateY', '100%', (0 - 10) + "px");
        }
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
    }
    return ToastSlideIn;
}(transition_1.Transition));
var ToastSlideOut = (function (_super) {
    __extends(ToastSlideOut, _super);
    function ToastSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var wrapperEle = ele.querySelector('.toast-wrapper');
        var wrapper = new animation_1.Animation(wrapperEle);
        if (leavingView.data && leavingView.data.position === TOAST_POSITION_TOP) {
            // top
            // reverse arguments from enter transition
            wrapper.fromTo('translateY', 10 + "px", '-100%');
        }
        else if (leavingView.data && leavingView.data.position === TOAST_POSITION_MIDDLE) {
            // Middle
            // just fade it out
            wrapper.fromTo('opacity', 0.99, 0);
        }
        else {
            // bottom
            // reverse arguments from enter transition
            wrapper.fromTo('translateY', (0 - 10) + "px", '100%');
        }
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(wrapper);
    }
    return ToastSlideOut;
}(transition_1.Transition));
var ToastMdSlideIn = (function (_super) {
    __extends(ToastMdSlideIn, _super);
    function ToastMdSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        // DOM reads
        var ele = enteringView.pageRef().nativeElement;
        var wrapperEle = ele.querySelector('.toast-wrapper');
        var wrapper = new animation_1.Animation(wrapperEle);
        if (enteringView.data && enteringView.data.position === TOAST_POSITION_TOP) {
            // top
            // by default, it is -100% hidden (above the screen)
            // so move from that to top: 0px;
            wrapper.fromTo('translateY', '-100%', "0%");
        }
        else if (enteringView.data && enteringView.data.position === TOAST_POSITION_MIDDLE) {
            // Middle
            // just center it and fade it in
            var topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
            // DOM WRITE
            wrapperEle.style.top = topPosition + "px";
            wrapper.fromTo('opacity', 0.01, 1);
        }
        else {
            // bottom
            // by default, it is 100% hidden (below the screen),
            // so move from that to bottom: 0px
            wrapper.fromTo('translateY', '100%', "0%");
        }
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(wrapper);
    }
    return ToastMdSlideIn;
}(transition_1.Transition));
var ToastMdSlideOut = (function (_super) {
    __extends(ToastMdSlideOut, _super);
    function ToastMdSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var wrapperEle = ele.querySelector('.toast-wrapper');
        var wrapper = new animation_1.Animation(wrapperEle);
        if (leavingView.data && leavingView.data.position === TOAST_POSITION_TOP) {
            // top
            // reverse arguments from enter transition
            wrapper.fromTo('translateY', 0 + "%", '-100%');
        }
        else if (leavingView.data && leavingView.data.position === TOAST_POSITION_MIDDLE) {
            // Middle
            // just fade it out
            wrapper.fromTo('opacity', 0.99, 0);
        }
        else {
            // bottom
            // reverse arguments from enter transition
            wrapper.fromTo('translateY', 0 + "%", '100%');
        }
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(wrapper);
    }
    return ToastMdSlideOut;
}(transition_1.Transition));
var ToastWpPopIn = (function (_super) {
    __extends(ToastWpPopIn, _super);
    function ToastWpPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var wrapperEle = ele.querySelector('.toast-wrapper');
        var wrapper = new animation_1.Animation(wrapperEle);
        if (enteringView.data && enteringView.data.position === TOAST_POSITION_TOP) {
            // top
            wrapper.fromTo('opacity', 0.01, 1);
            wrapper.fromTo('scale', 1.3, 1);
        }
        else if (enteringView.data && enteringView.data.position === TOAST_POSITION_MIDDLE) {
            // Middle
            // just center it and fade it in
            var topPosition = Math.floor(ele.clientHeight / 2 - wrapperEle.clientHeight / 2);
            // DOM WRITE
            wrapperEle.style.top = topPosition + "px";
            wrapper.fromTo('opacity', 0.01, 1);
            wrapper.fromTo('scale', 1.3, 1);
        }
        else {
            // bottom
            wrapper.fromTo('opacity', 0.01, 1);
            wrapper.fromTo('scale', 1.3, 1);
        }
        this.easing('cubic-bezier(0,0 0.05,1)').duration(200).add(wrapper);
    }
    return ToastWpPopIn;
}(transition_1.Transition));
var ToastWpPopOut = (function (_super) {
    __extends(ToastWpPopOut, _super);
    function ToastWpPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        // DOM reads
        var ele = leavingView.pageRef().nativeElement;
        var wrapperEle = ele.querySelector('.toast-wrapper');
        var wrapper = new animation_1.Animation(wrapperEle);
        if (leavingView.data && leavingView.data.position === TOAST_POSITION_TOP) {
            // top
            // reverse arguments from enter transition
            wrapper.fromTo('opacity', 0.99, 0);
            wrapper.fromTo('scale', 1, 1.3);
        }
        else if (leavingView.data && leavingView.data.position === TOAST_POSITION_MIDDLE) {
            // Middle
            // just fade it out
            wrapper.fromTo('opacity', 0.99, 0);
            wrapper.fromTo('scale', 1, 1.3);
        }
        else {
            // bottom
            // reverse arguments from enter transition
            wrapper.fromTo('opacity', 0.99, 0);
            wrapper.fromTo('scale', 1, 1.3);
        }
        // DOM writes
        var EASE = 'ease-out';
        var DURATION = 150;
        this.easing(EASE).duration(DURATION).add(wrapper);
    }
    return ToastWpPopOut;
}(transition_1.Transition));
transition_1.Transition.register('toast-slide-in', ToastSlideIn);
transition_1.Transition.register('toast-slide-out', ToastSlideOut);
transition_1.Transition.register('toast-md-slide-in', ToastMdSlideIn);
transition_1.Transition.register('toast-md-slide-out', ToastMdSlideOut);
transition_1.Transition.register('toast-wp-slide-out', ToastWpPopOut);
transition_1.Transition.register('toast-wp-slide-in', ToastWpPopIn);
var toastIds = -1;
var TOAST_POSITION_TOP = 'top';
var TOAST_POSITION_MIDDLE = 'middle';
var TOAST_POSITION_BOTTOM = 'bottom';
