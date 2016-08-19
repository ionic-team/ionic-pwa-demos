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
var form_1 = require('../../util/form');
var icon_1 = require('../icon/icon');
var key_1 = require('../../util/key');
var nav_params_1 = require('../nav/nav-params');
var transition_1 = require('../../transitions/transition');
var view_controller_1 = require('../nav/view-controller');
/**
 * @private
 */
var ActionSheetCmp = (function () {
    function ActionSheetCmp(_viewCtrl, _config, _elementRef, _form, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._config = _config;
        this._elementRef = _elementRef;
        this._form = _form;
        this.d = params.data;
        if (this.d.cssClass) {
            renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
        }
        this.id = (++actionSheetIds);
        if (this.d.title) {
            this.hdrId = 'acst-hdr-' + this.id;
        }
        if (this.d.subTitle) {
            this.descId = 'acst-subhdr-' + this.id;
        }
    }
    ActionSheetCmp.prototype.ionViewLoaded = function () {
        var _this = this;
        // normalize the data
        var buttons = [];
        this.d.buttons.forEach(function (button) {
            if (typeof button === 'string') {
                button = { text: button };
            }
            if (!button.cssClass) {
                button.cssClass = '';
            }
            if (button.role === 'cancel') {
                _this.d.cancelButton = button;
            }
            else {
                if (button.role === 'destructive') {
                    button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-destructive';
                }
                else if (button.role === 'selected') {
                    button.cssClass = (button.cssClass + ' ' || '') + 'action-sheet-selected';
                }
                buttons.push(button);
            }
        });
        this.d.buttons = buttons;
    };
    ActionSheetCmp.prototype.ionViewDidEnter = function () {
        this._form.focusOut();
        var focusableEle = this._elementRef.nativeElement.querySelector('button');
        if (focusableEle) {
            focusableEle.focus();
        }
        this.enabled = true;
    };
    ActionSheetCmp.prototype._keyUp = function (ev) {
        if (this.enabled && this._viewCtrl.isLast()) {
            if (ev.keyCode === key_1.Key.ESCAPE) {
                void 0;
                this.bdClick();
            }
        }
    };
    ActionSheetCmp.prototype.click = function (button, dismissDelay) {
        var _this = this;
        if (!this.enabled) {
            return;
        }
        var shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            if (button.handler() === false) {
                // if the return value of the handler is false then do not dismiss
                shouldDismiss = false;
            }
        }
        if (shouldDismiss) {
            setTimeout(function () {
                _this.dismiss(button.role);
            }, dismissDelay || this._config.get('pageTransitionDelay'));
        }
    };
    ActionSheetCmp.prototype.bdClick = function () {
        if (this.enabled && this.d.enableBackdropDismiss) {
            if (this.d.cancelButton) {
                this.click(this.d.cancelButton, 1);
            }
            else {
                this.dismiss('backdrop');
            }
        }
    };
    ActionSheetCmp.prototype.dismiss = function (role) {
        return this._viewCtrl.dismiss(null, role);
    };
    __decorate([
        core_1.HostListener('body:keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], ActionSheetCmp.prototype, "_keyUp", null);
    ActionSheetCmp = __decorate([
        core_1.Component({
            selector: 'ion-action-sheet',
            template: "\n    <ion-backdrop (click)=\"bdClick()\"></ion-backdrop>\n    <div class=\"action-sheet-wrapper\">\n      <div class=\"action-sheet-container\">\n        <div class=\"action-sheet-group\">\n          <div class=\"action-sheet-title\" id=\"{{hdrId}}\" *ngIf=\"d.title\">{{d.title}}</div>\n          <div class=\"action-sheet-sub-title\" id=\"{{descId}}\" *ngIf=\"d.subTitle\">{{d.subTitle}}</div>\n          <button category=\"action-sheet-button\" (click)=\"click(b)\" *ngFor=\"let b of d.buttons\" class=\"disable-hover\" [ngClass]=\"b.cssClass\">\n            <ion-icon [name]=\"b.icon\" *ngIf=\"b.icon\" class=\"action-sheet-icon\"></ion-icon>\n            {{b.text}}\n          </button>\n        </div>\n        <div class=\"action-sheet-group\" *ngIf=\"d.cancelButton\">\n          <button category=\"action-sheet-button\" (click)=\"click(d.cancelButton)\" class=\"action-sheet-cancel disable-hover\" [ngClass]=\"d.cancelButton.cssClass\">\n            <ion-icon [name]=\"d.cancelButton.icon\" *ngIf=\"d.cancelButton.icon\" class=\"action-sheet-icon\"></ion-icon>\n            {{d.cancelButton.text}}\n          </button>\n        </div>\n      </div>\n    </div>\n    ",
            directives: [backdrop_1.Backdrop, icon_1.Icon, common_1.NgClass, common_1.NgFor, common_1.NgIf],
            host: {
                'role': 'dialog',
                '[attr.aria-labelledby]': 'hdrId',
                '[attr.aria-describedby]': 'descId'
            },
            encapsulation: core_1.ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, config_1.Config, core_1.ElementRef, form_1.Form, nav_params_1.NavParams, core_1.Renderer])
    ], ActionSheetCmp);
    return ActionSheetCmp;
}());
exports.ActionSheetCmp = ActionSheetCmp;
var ActionSheetSlideIn = (function (_super) {
    __extends(ActionSheetSlideIn, _super);
    function ActionSheetSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.4);
        wrapper.fromTo('translateY', '100%', '0%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
    }
    return ActionSheetSlideIn;
}(transition_1.Transition));
transition_1.Transition.register('action-sheet-slide-in', ActionSheetSlideIn);
var ActionSheetSlideOut = (function (_super) {
    __extends(ActionSheetSlideOut, _super);
    function ActionSheetSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.4, 0);
        wrapper.fromTo('translateY', '0%', '100%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(300).add(backdrop).add(wrapper);
    }
    return ActionSheetSlideOut;
}(transition_1.Transition));
transition_1.Transition.register('action-sheet-slide-out', ActionSheetSlideOut);
var ActionSheetMdSlideIn = (function (_super) {
    __extends(ActionSheetMdSlideIn, _super);
    function ActionSheetMdSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.26);
        wrapper.fromTo('translateY', '100%', '0%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
    }
    return ActionSheetMdSlideIn;
}(transition_1.Transition));
transition_1.Transition.register('action-sheet-md-slide-in', ActionSheetMdSlideIn);
var ActionSheetMdSlideOut = (function (_super) {
    __extends(ActionSheetMdSlideOut, _super);
    function ActionSheetMdSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.26, 0);
        wrapper.fromTo('translateY', '0%', '100%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
    }
    return ActionSheetMdSlideOut;
}(transition_1.Transition));
transition_1.Transition.register('action-sheet-md-slide-out', ActionSheetMdSlideOut);
var ActionSheetWpSlideIn = (function (_super) {
    __extends(ActionSheetWpSlideIn, _super);
    function ActionSheetWpSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.16);
        wrapper.fromTo('translateY', '100%', '0%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(400).add(backdrop).add(wrapper);
    }
    return ActionSheetWpSlideIn;
}(transition_1.Transition));
transition_1.Transition.register('action-sheet-wp-slide-in', ActionSheetWpSlideIn);
var ActionSheetWpSlideOut = (function (_super) {
    __extends(ActionSheetWpSlideOut, _super);
    function ActionSheetWpSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.action-sheet-wrapper'));
        backdrop.fromTo('opacity', 0.1, 0);
        wrapper.fromTo('translateY', '0%', '100%');
        this.easing('cubic-bezier(.36,.66,.04,1)').duration(450).add(backdrop).add(wrapper);
    }
    return ActionSheetWpSlideOut;
}(transition_1.Transition));
transition_1.Transition.register('action-sheet-wp-slide-out', ActionSheetWpSlideOut);
var actionSheetIds = -1;
