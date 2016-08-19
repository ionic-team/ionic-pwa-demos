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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var app_1 = require('../components/app/app');
var dom_1 = require('./dom');
var config_1 = require('../config/config');
var DEFAULT_EXPIRE = 330;
/**
 * @private
 */
var ClickBlock = (function () {
    function ClickBlock(app, config, elementRef, renderer) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this._showing = false;
        app.clickBlock = this;
        this.isEnabled = config.getBoolean('clickBlock', true);
    }
    ClickBlock.prototype.activate = function (shouldShow, expire) {
        if (this.isEnabled) {
            dom_1.clearNativeTimeout(this._tmrId);
            if (shouldShow) {
                this._tmrId = dom_1.nativeTimeout(this.activate.bind(this, false), expire || DEFAULT_EXPIRE);
            }
            if (this._showing !== shouldShow) {
                this.renderer.setElementClass(this.elementRef.nativeElement, 'click-block-active', shouldShow);
                this._showing = shouldShow;
            }
        }
    };
    ClickBlock = __decorate([
        core_1.Directive({
            selector: 'click-block'
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return app_1.App; }))), 
        __metadata('design:paramtypes', [app_1.App, config_1.Config, core_1.ElementRef, core_1.Renderer])
    ], ClickBlock);
    return ClickBlock;
}());
exports.ClickBlock = ClickBlock;
