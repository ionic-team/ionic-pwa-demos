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
var picker_component_1 = require('./picker-component');
var view_controller_1 = require('../nav/view-controller');
/**
 * @private
 */
var Picker = (function (_super) {
    __extends(Picker, _super);
    function Picker(app, opts) {
        if (opts === void 0) { opts = {}; }
        opts.columns = opts.columns || [];
        opts.buttons = opts.buttons || [];
        opts.enableBackdropDismiss = util_1.isPresent(opts.enableBackdropDismiss) ? !!opts.enableBackdropDismiss : true;
        _super.call(this, picker_component_1.PickerCmp, opts);
        this._app = app;
        this.isOverlay = true;
        this.ionChange = new core_1.EventEmitter();
        // by default, pickers should not fire lifecycle events of other views
        // for example, when an picker enters, the current active view should
        // not fire its lifecycle events because it's not conceptually leaving
        this.fireOtherLifecycles = false;
    }
    /**
    * @private
    */
    Picker.prototype.getTransitionName = function (direction) {
        var key = (direction === 'back' ? 'pickerLeave' : 'pickerEnter');
        return this._nav && this._nav.config.get(key);
    };
    /**
     * @param {any} button Picker toolbar button
     */
    Picker.prototype.addButton = function (button) {
        this.data.buttons.push(button);
    };
    /**
     * @param {any} button Picker toolbar button
     */
    Picker.prototype.addColumn = function (column) {
        this.data.columns.push(column);
    };
    Picker.prototype.getColumns = function () {
        return this.data.columns;
    };
    Picker.prototype.refresh = function () {
        this.instance.refresh && this.instance.refresh();
    };
    /**
     * @param {string} cssClass CSS class name to add to the picker's outer wrapper.
     */
    Picker.prototype.setCssClass = function (cssClass) {
        this.data.cssClass = cssClass;
    };
    /**
     * Present the picker instance.
     *
     * @param {NavOptions} [opts={}] Nav options to go with this transition.
     * @returns {Promise} Returns a promise which is resolved when the transition has completed.
     */
    Picker.prototype.present = function (navOptions) {
        if (navOptions === void 0) { navOptions = {}; }
        return this._app.present(this, navOptions);
    };
    /**
     * @private
     * DEPRECATED: Please inject PickerController instead
     */
    Picker.create = function (opt) {
        // deprecated warning: added beta.11 2016-06-27
        void 0;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Picker.prototype, "ionChange", void 0);
    return Picker;
}(view_controller_1.ViewController));
exports.Picker = Picker;
/**
 * @private
 * @name PickerController
 * @description
 *
 */
var PickerController = (function () {
    function PickerController(_app) {
        this._app = _app;
    }
    /**
     * Open a picker.
     */
    PickerController.prototype.create = function (opts) {
        if (opts === void 0) { opts = {}; }
        return new Picker(this._app, opts);
    };
    PickerController = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [app_1.App])
    ], PickerController);
    return PickerController;
}());
exports.PickerController = PickerController;
