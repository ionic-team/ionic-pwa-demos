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
var GestureController = (function () {
    function GestureController(_app) {
        this._app = _app;
        this.id = 1;
        this.requestedStart = {};
        this.disabledGestures = {};
        this.disabledScroll = new Set();
        this.capturedID = null;
    }
    GestureController.prototype.create = function (name, opts) {
        if (opts === void 0) { opts = {}; }
        return new GestureDelegate(name, this.newID(), this, opts);
    };
    GestureController.prototype.newID = function () {
        var id = this.id;
        this.id++;
        return id;
    };
    GestureController.prototype.start = function (gestureName, id, priority) {
        if (!this.canStart(gestureName)) {
            delete this.requestedStart[id];
            return false;
        }
        this.requestedStart[id] = priority;
        return true;
    };
    GestureController.prototype.capture = function (gestureName, id, priority) {
        if (!this.start(gestureName, id, priority)) {
            return false;
        }
        var requestedStart = this.requestedStart;
        var maxPriority = -10000 /* Minimun */;
        for (var gestureID in requestedStart) {
            maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
        }
        if (maxPriority === priority) {
            this.capturedID = id;
            this.requestedStart = {};
            return true;
        }
        delete requestedStart[id];
        void 0;
        return false;
    };
    GestureController.prototype.release = function (id) {
        delete this.requestedStart[id];
        if (this.capturedID && id === this.capturedID) {
            this.capturedID = null;
        }
    };
    GestureController.prototype.disableGesture = function (gestureName, id) {
        var set = this.disabledGestures[gestureName];
        if (!set) {
            set = new Set();
            this.disabledGestures[gestureName] = set;
        }
        set.add(id);
    };
    GestureController.prototype.enableGesture = function (gestureName, id) {
        var set = this.disabledGestures[gestureName];
        if (set) {
            set.delete(id);
        }
    };
    GestureController.prototype.disableScroll = function (id) {
        var isEnabled = !this.isScrollDisabled();
        this.disabledScroll.add(id);
        if (this._app && isEnabled && this.isScrollDisabled()) {
            void 0;
            this._app.setScrollDisabled(true);
        }
    };
    GestureController.prototype.enableScroll = function (id) {
        var isDisabled = this.isScrollDisabled();
        this.disabledScroll.delete(id);
        if (this._app && isDisabled && !this.isScrollDisabled()) {
            void 0;
            this._app.setScrollDisabled(false);
        }
    };
    GestureController.prototype.canStart = function (gestureName) {
        if (this.capturedID) {
            // a gesture already captured
            return false;
        }
        if (this.isDisabled(gestureName)) {
            return false;
        }
        return true;
    };
    GestureController.prototype.isCaptured = function () {
        return !!this.capturedID;
    };
    GestureController.prototype.isScrollDisabled = function () {
        return this.disabledScroll.size > 0;
    };
    GestureController.prototype.isDisabled = function (gestureName) {
        var disabled = this.disabledGestures[gestureName];
        if (disabled && disabled.size > 0) {
            return true;
        }
        return false;
    };
    GestureController = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return app_1.App; }))), 
        __metadata('design:paramtypes', [app_1.App])
    ], GestureController);
    return GestureController;
}());
exports.GestureController = GestureController;
var GestureDelegate = (function () {
    function GestureDelegate(name, id, controller, opts) {
        this.name = name;
        this.id = id;
        this.controller = controller;
        this.priority = 0;
        this.disable = opts.disable || [];
        this.disableScroll = opts.disableScroll || 0 /* Never */;
        this.priority = opts.priority || 0;
        // Disable gestures
        for (var _i = 0, _a = this.disable; _i < _a.length; _i++) {
            var gestureName = _a[_i];
            controller.disableGesture(gestureName, id);
        }
        // Disable scrolling (always)
        if (this.disableScroll === 2 /* Always */) {
            controller.disableScroll(id);
        }
    }
    GestureDelegate.prototype.canStart = function () {
        if (!this.controller) {
            return false;
        }
        return this.controller.canStart(this.name);
    };
    GestureDelegate.prototype.start = function () {
        if (!this.controller) {
            return false;
        }
        return this.controller.start(this.name, this.id, this.priority);
    };
    GestureDelegate.prototype.capture = function () {
        if (!this.controller) {
            return false;
        }
        var captured = this.controller.capture(this.name, this.id, this.priority);
        if (captured && this.disableScroll === 1 /* DuringCapture */) {
            this.controller.disableScroll(this.id);
        }
        return captured;
    };
    GestureDelegate.prototype.release = function () {
        if (!this.controller) {
            return;
        }
        this.controller.release(this.id);
        if (this.disableScroll === 1 /* DuringCapture */) {
            this.controller.enableScroll(this.id);
        }
    };
    GestureDelegate.prototype.destroy = function () {
        if (!this.controller) {
            return;
        }
        this.release();
        for (var _i = 0, _a = this.disable; _i < _a.length; _i++) {
            var disabled = _a[_i];
            this.controller.enableGesture(disabled, this.id);
        }
        if (this.disableScroll === 2 /* Always */) {
            this.controller.enableScroll(this.id);
        }
        this.controller = null;
    };
    return GestureDelegate;
}());
exports.GestureDelegate = GestureDelegate;
