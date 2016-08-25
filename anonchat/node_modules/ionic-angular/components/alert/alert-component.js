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
var forms_1 = require('@angular/forms');
var animation_1 = require('../../animations/animation');
var backdrop_1 = require('../backdrop/backdrop');
var config_1 = require('../../config/config');
var util_1 = require('../../util/util');
var key_1 = require('../../util/key');
var nav_params_1 = require('../nav/nav-params');
var transition_1 = require('../../transitions/transition');
var view_controller_1 = require('../nav/view-controller');
/**
 * @private
 */
var AlertCmp = (function () {
    function AlertCmp(_viewCtrl, _elementRef, _config, params, renderer) {
        this._viewCtrl = _viewCtrl;
        this._elementRef = _elementRef;
        this._config = _config;
        this.d = params.data;
        if (this.d.cssClass) {
            this.d.cssClass.split(' ').forEach(function (cssClass) {
                // Make sure the class isn't whitespace, otherwise it throws exceptions
                if (cssClass.trim() !== '')
                    renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
            });
        }
        this.id = (++alertIds);
        this.descId = '';
        this.hdrId = 'alert-hdr-' + this.id;
        this.subHdrId = 'alert-subhdr-' + this.id;
        this.msgId = 'alert-msg-' + this.id;
        this.activeId = '';
        this.lastClick = 0;
        if (this.d.message) {
            this.descId = this.msgId;
        }
        else if (this.d.subTitle) {
            this.descId = this.subHdrId;
        }
        if (!this.d.message) {
            this.d.message = '';
        }
    }
    AlertCmp.prototype.ionViewLoaded = function () {
        var _this = this;
        // normalize the data
        var data = this.d;
        data.buttons = data.buttons.map(function (button) {
            if (typeof button === 'string') {
                return { text: button };
            }
            return button;
        });
        data.inputs = data.inputs.map(function (input, index) {
            return {
                type: input.type || 'text',
                name: util_1.isPresent(input.name) ? input.name : index,
                placeholder: util_1.isPresent(input.placeholder) ? input.placeholder : '',
                value: util_1.isPresent(input.value) ? input.value : '',
                label: input.label,
                checked: !!input.checked,
                disabled: !!input.disabled,
                id: 'alert-input-' + _this.id + '-' + index
            };
        });
        // An alert can be created with several different inputs. Radios,
        // checkboxes and inputs are all accepted, but they cannot be mixed.
        var inputTypes = [];
        data.inputs.forEach(function (input) {
            if (inputTypes.indexOf(input.type) < 0) {
                inputTypes.push(input.type);
            }
        });
        if (inputTypes.length > 1 && (inputTypes.indexOf('checkbox') > -1 || inputTypes.indexOf('radio') > -1)) {
            void 0;
        }
        this.inputType = inputTypes.length ? inputTypes[0] : null;
        var checkedInput = this.d.inputs.find(function (input) { return input.checked; });
        if (checkedInput) {
            this.activeId = checkedInput.id;
        }
    };
    AlertCmp.prototype._keyUp = function (ev) {
        if (this.enabled && this._viewCtrl.isLast()) {
            if (ev.keyCode === key_1.Key.ENTER) {
                if (this.lastClick + 1000 < Date.now()) {
                    // do not fire this click if there recently was already a click
                    // this can happen when the button has focus and used the enter
                    // key to click the button. However, both the click handler and
                    // this keyup event will fire, so only allow one of them to go.
                    void 0;
                    var button = this.d.buttons[this.d.buttons.length - 1];
                    this.btnClick(button);
                }
            }
            else if (ev.keyCode === key_1.Key.ESCAPE) {
                void 0;
                this.bdClick();
            }
        }
    };
    AlertCmp.prototype.ionViewDidEnter = function () {
        var activeElement = document.activeElement;
        if (document.activeElement) {
            activeElement.blur();
        }
        var focusableEle = this._elementRef.nativeElement.querySelector('input,button');
        if (focusableEle) {
            focusableEle.focus();
        }
        this.enabled = true;
    };
    AlertCmp.prototype.btnClick = function (button, dismissDelay) {
        var _this = this;
        if (!this.enabled) {
            return;
        }
        // keep the time of the most recent button click
        this.lastClick = Date.now();
        var shouldDismiss = true;
        if (button.handler) {
            // a handler has been provided, execute it
            // pass the handler the values from the inputs
            if (button.handler(this.getValues()) === false) {
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
    AlertCmp.prototype.rbClick = function (checkedInput) {
        if (this.enabled) {
            this.d.inputs.forEach(function (input) {
                input.checked = (checkedInput === input);
            });
            this.activeId = checkedInput.id;
        }
    };
    AlertCmp.prototype.cbClick = function (checkedInput) {
        if (this.enabled) {
            checkedInput.checked = !checkedInput.checked;
        }
    };
    AlertCmp.prototype.bdClick = function () {
        if (this.enabled && this.d.enableBackdropDismiss) {
            var cancelBtn = this.d.buttons.find(function (b) { return b.role === 'cancel'; });
            if (cancelBtn) {
                this.btnClick(cancelBtn, 1);
            }
            else {
                this.dismiss('backdrop');
            }
        }
    };
    AlertCmp.prototype.dismiss = function (role) {
        return this._viewCtrl.dismiss(this.getValues(), role);
    };
    AlertCmp.prototype.getValues = function () {
        if (this.inputType === 'radio') {
            // this is an alert with radio buttons (single value select)
            // return the one value which is checked, otherwise undefined
            var checkedInput = this.d.inputs.find(function (i) { return i.checked; });
            return checkedInput ? checkedInput.value : undefined;
        }
        if (this.inputType === 'checkbox') {
            // this is an alert with checkboxes (multiple value select)
            // return an array of all the checked values
            return this.d.inputs.filter(function (i) { return i.checked; }).map(function (i) { return i.value; });
        }
        // this is an alert with text inputs
        // return an object of all the values with the input name as the key
        var values = {};
        this.d.inputs.forEach(function (i) {
            values[i.name] = i.value;
        });
        return values;
    };
    __decorate([
        core_1.HostListener('body:keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], AlertCmp.prototype, "_keyUp", null);
    AlertCmp = __decorate([
        core_1.Component({
            selector: 'ion-alert',
            template: "\n    <ion-backdrop (click)=\"bdClick()\"></ion-backdrop>\n    <div class=\"alert-wrapper\">\n      <div class=\"alert-head\">\n        <h2 id=\"{{hdrId}}\" class=\"alert-title\" *ngIf=\"d.title\" [innerHTML]=\"d.title\"></h2>\n        <h3 id=\"{{subHdrId}}\" class=\"alert-sub-title\" *ngIf=\"d.subTitle\" [innerHTML]=\"d.subTitle\"></h3>\n      </div>\n      <div id=\"{{msgId}}\" class=\"alert-message\" [innerHTML]=\"d.message\"></div>\n      <div *ngIf=\"d.inputs.length\" [ngSwitch]=\"inputType\">\n\n        <template ngSwitchCase=\"radio\">\n          <div class=\"alert-radio-group\" role=\"radiogroup\" [attr.aria-labelledby]=\"hdrId\" [attr.aria-activedescendant]=\"activeId\">\n            <button category=\"alert-radio-button\" *ngFor=\"let i of d.inputs\" (click)=\"rbClick(i)\" [attr.aria-checked]=\"i.checked\" [disabled]=\"i.disabled\" [attr.id]=\"i.id\" class=\"alert-tappable alert-radio\" role=\"radio\">\n              <div class=\"alert-radio-icon\"><div class=\"alert-radio-inner\"></div></div>\n              <div class=\"alert-radio-label\">\n                {{i.label}}\n              </div>\n            </button>\n          </div>\n        </template>\n\n        <template ngSwitchCase=\"checkbox\">\n          <div class=\"alert-checkbox-group\">\n            <button category=\"alert-checkbox-button\" *ngFor=\"let i of d.inputs\" (click)=\"cbClick(i)\" [attr.aria-checked]=\"i.checked\" [disabled]=\"i.disabled\" class=\"alert-tappable alert-checkbox\" role=\"checkbox\">\n              <div class=\"alert-checkbox-icon\"><div class=\"alert-checkbox-inner\"></div></div>\n              <div class=\"alert-checkbox-label\">\n                {{i.label}}\n              </div>\n            </button>\n          </div>\n        </template>\n\n        <template ngSwitchDefault>\n          <div class=\"alert-input-group\">\n            <div *ngFor=\"let i of d.inputs\" class=\"alert-input-wrapper\">\n              <input [placeholder]=\"i.placeholder\" [(ngModel)]=\"i.value\" [type]=\"i.type\" class=\"alert-input\">\n            </div>\n          </div>\n        </template>\n\n      </div>\n      <div class=\"alert-button-group\" [ngClass]=\"{vertical: d.buttons.length>2}\">\n        <button category=\"alert-button\" *ngFor=\"let b of d.buttons\" (click)=\"btnClick(b)\" [ngClass]=\"b.cssClass\">\n          {{b.text}}\n        </button>\n      </div>\n    </div>\n    ",
            directives: [backdrop_1.Backdrop, common_1.NgClass, common_1.NgFor, common_1.NgIf, forms_1.NgModel, common_1.NgSwitch, common_1.NgSwitchCase, common_1.NgSwitchDefault],
            host: {
                'role': 'dialog',
                '[attr.aria-labelledby]': 'hdrId',
                '[attr.aria-describedby]': 'descId'
            },
            encapsulation: core_1.ViewEncapsulation.None,
        }), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, core_1.ElementRef, config_1.Config, nav_params_1.NavParams, core_1.Renderer])
    ], AlertCmp);
    return AlertCmp;
}());
exports.AlertCmp = AlertCmp;
/**
 * Animations for alerts
 */
var AlertPopIn = (function (_super) {
    __extends(AlertPopIn, _super);
    function AlertPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.3);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertPopIn;
}(transition_1.Transition));
transition_1.Transition.register('alert-pop-in', AlertPopIn);
var AlertPopOut = (function (_super) {
    __extends(AlertPopOut, _super);
    function AlertPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.3, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertPopOut;
}(transition_1.Transition));
transition_1.Transition.register('alert-pop-out', AlertPopOut);
var AlertMdPopIn = (function (_super) {
    __extends(AlertMdPopIn, _super);
    function AlertMdPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.1, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertMdPopIn;
}(transition_1.Transition));
transition_1.Transition.register('alert-md-pop-in', AlertMdPopIn);
var AlertMdPopOut = (function (_super) {
    __extends(AlertMdPopOut, _super);
    function AlertMdPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 0.9);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-in-out')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertMdPopOut;
}(transition_1.Transition));
transition_1.Transition.register('alert-md-pop-out', AlertMdPopOut);
var AlertWpPopIn = (function (_super) {
    __extends(AlertWpPopIn, _super);
    function AlertWpPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1).fromTo('scale', 1.3, 1);
        backdrop.fromTo('opacity', 0.01, 0.5);
        this
            .easing('cubic-bezier(0,0 0.05,1)')
            .duration(200)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertWpPopIn;
}(transition_1.Transition));
transition_1.Transition.register('alert-wp-pop-in', AlertWpPopIn);
var AlertWpPopOut = (function (_super) {
    __extends(AlertWpPopOut, _super);
    function AlertWpPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.alert-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0).fromTo('scale', 1, 1.3);
        backdrop.fromTo('opacity', 0.5, 0);
        this
            .easing('ease-out')
            .duration(150)
            .add(backdrop)
            .add(wrapper);
    }
    return AlertWpPopOut;
}(transition_1.Transition));
transition_1.Transition.register('alert-wp-pop-out', AlertWpPopOut);
var alertIds = -1;
