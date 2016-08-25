var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
    var c = arguments.length,
        r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
        d;
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
        if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    }return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = this && this.__metadata || function (k, v) {
    if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Directive, ElementRef, Input } from '@angular/core';
import { GestureController } from '../../gestures/gesture-controller';
import { isTrueProperty } from '../../util/util';
/**
 * @private
 */
export var Backdrop = function () {
    function Backdrop(_gestureCtrl, _elementRef) {
        _classCallCheck(this, Backdrop);

        this._gestureCtrl = _gestureCtrl;
        this._elementRef = _elementRef;
        this._gestureID = null;
        this.disableScroll = true;
    }

    _createClass(Backdrop, [{
        key: "ngOnInit",
        value: function ngOnInit() {
            if (isTrueProperty(this.disableScroll)) {
                this._gestureID = this._gestureCtrl.newID();
                this._gestureCtrl.disableScroll(this._gestureID);
            }
        }
    }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
            if (this._gestureID) {
                this._gestureCtrl.enableScroll(this._gestureID);
            }
        }
    }, {
        key: "getNativeElement",
        value: function getNativeElement() {
            return this._elementRef.nativeElement;
        }
    }]);

    return Backdrop;
}();
__decorate([Input(), __metadata('design:type', Object)], Backdrop.prototype, "disableScroll", void 0);
Backdrop = __decorate([Directive({
    selector: 'ion-backdrop',
    host: {
        'role': 'presentation',
        'tappable': '',
        'disable-activated': ''
    }
}), __metadata('design:paramtypes', [typeof (_a = typeof GestureController !== 'undefined' && GestureController) === 'function' && _a || Object, typeof (_b = typeof ElementRef !== 'undefined' && ElementRef) === 'function' && _b || Object])], Backdrop);
var _a, _b;