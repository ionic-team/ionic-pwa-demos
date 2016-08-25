"use strict";
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
var gesture_controller_1 = require('../../gestures/gesture-controller');
var util_1 = require('../../util/util');
/**
 * @private
 */
var Backdrop = (function () {
    function Backdrop(_gestureCtrl, _elementRef) {
        this._gestureCtrl = _gestureCtrl;
        this._elementRef = _elementRef;
        this._gestureID = null;
        this.disableScroll = true;
    }
    Backdrop.prototype.ngOnInit = function () {
        if (util_1.isTrueProperty(this.disableScroll)) {
            this._gestureID = this._gestureCtrl.newID();
            this._gestureCtrl.disableScroll(this._gestureID);
        }
    };
    Backdrop.prototype.ngOnDestroy = function () {
        if (this._gestureID) {
            this._gestureCtrl.enableScroll(this._gestureID);
        }
    };
    Backdrop.prototype.getNativeElement = function () {
        return this._elementRef.nativeElement;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Backdrop.prototype, "disableScroll", void 0);
    Backdrop = __decorate([
        core_1.Directive({
            selector: 'ion-backdrop',
            host: {
                'role': 'presentation',
                'tappable': '',
                'disable-activated': ''
            },
        }), 
        __metadata('design:paramtypes', [gesture_controller_1.GestureController, core_1.ElementRef])
    ], Backdrop);
    return Backdrop;
}());
exports.Backdrop = Backdrop;
