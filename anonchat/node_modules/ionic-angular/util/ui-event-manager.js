"use strict";
/**
 * @private
 */
var PointerEvents = (function () {
    function PointerEvents(ele, pointerDown, pointerMove, pointerUp, zone, option) {
        this.ele = ele;
        this.pointerDown = pointerDown;
        this.pointerMove = pointerMove;
        this.pointerUp = pointerUp;
        this.zone = zone;
        this.option = option;
        this.rmTouchStart = null;
        this.rmTouchMove = null;
        this.rmTouchEnd = null;
        this.rmTouchCancel = null;
        this.rmMouseStart = null;
        this.rmMouseMove = null;
        this.rmMouseUp = null;
        this.lastTouchEvent = 0;
        this.mouseWait = 2 * 1000;
        this.bindTouchEnd = this.handleTouchEnd.bind(this);
        this.bindMouseUp = this.handleMouseUp.bind(this);
        this.rmTouchStart = listenEvent(ele, 'touchstart', zone, option, this.handleTouchStart.bind(this));
        this.rmMouseStart = listenEvent(ele, 'mousedown', zone, option, this.handleMouseDown.bind(this));
    }
    PointerEvents.prototype.handleTouchStart = function (ev) {
        this.lastTouchEvent = Date.now() + this.mouseWait;
        if (!this.pointerDown(ev)) {
            return;
        }
        if (!this.rmTouchMove) {
            this.rmTouchMove = listenEvent(this.ele, 'touchmove', this.zone, this.option, this.pointerMove);
        }
        if (!this.rmTouchEnd) {
            this.rmTouchEnd = listenEvent(this.ele, 'touchend', this.zone, this.option, this.bindTouchEnd);
        }
        if (!this.rmTouchCancel) {
            this.rmTouchCancel = listenEvent(this.ele, 'touchcancel', this.zone, this.option, this.bindTouchEnd);
        }
    };
    PointerEvents.prototype.handleMouseDown = function (ev) {
        if (this.lastTouchEvent > Date.now()) {
            void 0;
            return;
        }
        if (!this.pointerDown(ev)) {
            return;
        }
        if (!this.rmMouseMove) {
            this.rmMouseMove = listenEvent(document, 'mousemove', this.zone, this.option, this.pointerMove);
        }
        if (!this.rmMouseUp) {
            this.rmMouseUp = listenEvent(document, 'mouseup', this.zone, this.option, this.bindMouseUp);
        }
    };
    PointerEvents.prototype.handleTouchEnd = function (ev) {
        this.stopTouch();
        this.pointerUp(ev);
    };
    PointerEvents.prototype.handleMouseUp = function (ev) {
        this.stopMouse();
        this.pointerUp(ev);
    };
    PointerEvents.prototype.stopTouch = function () {
        this.rmTouchMove && this.rmTouchMove();
        this.rmTouchEnd && this.rmTouchEnd();
        this.rmTouchCancel && this.rmTouchCancel();
        this.rmTouchMove = null;
        this.rmTouchEnd = null;
        this.rmTouchCancel = null;
    };
    PointerEvents.prototype.stopMouse = function () {
        this.rmMouseMove && this.rmMouseMove();
        this.rmMouseUp && this.rmMouseUp();
        this.rmMouseMove = null;
        this.rmMouseUp = null;
    };
    PointerEvents.prototype.stop = function () {
        this.stopTouch();
        this.stopMouse();
    };
    PointerEvents.prototype.destroy = function () {
        this.rmTouchStart && this.rmTouchStart();
        this.rmTouchStart = null;
        this.rmMouseStart && this.rmMouseStart();
        this.rmMouseStart = null;
        this.stop();
        this.pointerDown = null;
        this.pointerMove = null;
        this.pointerUp = null;
        this.ele = null;
    };
    return PointerEvents;
}());
exports.PointerEvents = PointerEvents;
/**
 * @private
 */
var UIEventManager = (function () {
    function UIEventManager(zoneWrapped) {
        if (zoneWrapped === void 0) { zoneWrapped = true; }
        this.zoneWrapped = zoneWrapped;
        this.events = [];
    }
    UIEventManager.prototype.listenRef = function (ref, eventName, callback, option) {
        return this.listen(ref.nativeElement, eventName, callback, option);
    };
    UIEventManager.prototype.pointerEvents = function (config) {
        var element = config.element;
        if (!element) {
            element = config.elementRef.nativeElement;
        }
        if (!element || !config.pointerDown || !config.pointerMove || !config.pointerUp) {
            void 0;
            return;
        }
        var zone = config.zone || this.zoneWrapped;
        var options = config.nativeOptions || false;
        var submanager = new PointerEvents(element, config.pointerDown, config.pointerMove, config.pointerUp, zone, options);
        var removeFunc = function () { return submanager.destroy(); };
        this.events.push(removeFunc);
        return submanager;
    };
    UIEventManager.prototype.listen = function (element, eventName, callback, option) {
        if (option === void 0) { option = false; }
        if (!element) {
            return;
        }
        var removeFunc = listenEvent(element, eventName, this.zoneWrapped, option, callback);
        this.events.push(removeFunc);
        return removeFunc;
    };
    UIEventManager.prototype.unlistenAll = function () {
        for (var _i = 0, _a = this.events; _i < _a.length; _i++) {
            var event_1 = _a[_i];
            event_1();
        }
        this.events.length = 0;
    };
    return UIEventManager;
}());
exports.UIEventManager = UIEventManager;
function listenEvent(ele, eventName, zoneWrapped, option, callback) {
    var rawEvent = ('__zone_symbol__addEventListener' in ele && !zoneWrapped);
    if (rawEvent) {
        ele.__zone_symbol__addEventListener(eventName, callback, option);
        return function () { return ele.__zone_symbol__removeEventListener(eventName, callback); };
    }
    else {
        ele.addEventListener(eventName, callback, option);
        return function () { return ele.removeEventListener(eventName, callback); };
    }
}
