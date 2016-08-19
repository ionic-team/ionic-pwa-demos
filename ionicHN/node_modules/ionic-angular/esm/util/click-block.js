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
var __param = this && this.__param || function (paramIndex, decorator) {
    return function (target, key) {
        decorator(target, key, paramIndex);
    };
};
import { Directive, ElementRef, forwardRef, Inject, Renderer } from '@angular/core';
import { App } from '../components/app/app';
import { clearNativeTimeout, nativeTimeout } from './dom';
import { Config } from '../config/config';
var DEFAULT_EXPIRE = 330;
/**
 * @private
 */
export var ClickBlock = function () {
    function ClickBlock(app, config, elementRef, renderer) {
        _classCallCheck(this, ClickBlock);

        this.elementRef = elementRef;
        this.renderer = renderer;
        this._showing = false;
        app.clickBlock = this;
        this.isEnabled = config.getBoolean('clickBlock', true);
    }

    _createClass(ClickBlock, [{
        key: "activate",
        value: function activate(shouldShow, expire) {
            if (this.isEnabled) {
                clearNativeTimeout(this._tmrId);
                if (shouldShow) {
                    this._tmrId = nativeTimeout(this.activate.bind(this, false), expire || DEFAULT_EXPIRE);
                }
                if (this._showing !== shouldShow) {
                    this.renderer.setElementClass(this.elementRef.nativeElement, 'click-block-active', shouldShow);
                    this._showing = shouldShow;
                }
            }
        }
    }]);

    return ClickBlock;
}();
ClickBlock = __decorate([Directive({
    selector: 'click-block'
}), __param(0, Inject(forwardRef(function () {
    return App;
}))), __metadata('design:paramtypes', [typeof (_a = typeof App !== 'undefined' && App) === 'function' && _a || Object, typeof (_b = typeof Config !== 'undefined' && Config) === 'function' && _b || Object, typeof (_c = typeof ElementRef !== 'undefined' && ElementRef) === 'function' && _c || Object, typeof (_d = typeof Renderer !== 'undefined' && Renderer) === 'function' && _d || Object])], ClickBlock);
var _a, _b, _c, _d;