"use strict";
var util_1 = require('../util');
var ui_event_manager_1 = require('../util/ui-event-manager');
var recognizers_1 = require('./recognizers');
var dom_1 = require('../util/dom');
/**
 * @private
 */
var PanGesture = (function () {
    function PanGesture(element, opts) {
        if (opts === void 0) { opts = {}; }
        this.element = element;
        this.events = new ui_event_manager_1.UIEventManager(false);
        this.started = false;
        this.captured = false;
        this.isListening = false;
        util_1.defaults(opts, {
            threshold: 20,
            maxAngle: 40,
            direction: 'x'
        });
        this.gestute = opts.gesture;
        this.direction = opts.direction;
        this.detector = new recognizers_1.PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
    }
    PanGesture.prototype.listen = function () {
        if (!this.isListening) {
            this.pointerEvents = this.events.pointerEvents({
                element: this.element,
                pointerDown: this.pointerDown.bind(this),
                pointerMove: this.pointerMove.bind(this),
                pointerUp: this.pointerUp.bind(this),
            });
            this.isListening = true;
        }
    };
    PanGesture.prototype.unlisten = function () {
        this.gestute && this.gestute.release();
        this.events.unlistenAll();
        this.isListening = false;
    };
    PanGesture.prototype.destroy = function () {
        this.gestute && this.gestute.destroy();
        this.unlisten();
        this.element = null;
    };
    PanGesture.prototype.pointerDown = function (ev) {
        if (this.started) {
            return;
        }
        if (!this.canStart(ev)) {
            return false;
        }
        if (this.gestute) {
            // Release fallback
            this.gestute.release();
            // Start gesture
            if (!this.gestute.start()) {
                return false;
            }
        }
        var coord = dom_1.pointerCoord(ev);
        this.detector.start(coord);
        this.started = true;
        this.captured = false;
        return true;
    };
    PanGesture.prototype.pointerMove = function (ev) {
        if (!this.started) {
            return;
        }
        if (this.captured) {
            this.onDragMove(ev);
            return;
        }
        var coord = dom_1.pointerCoord(ev);
        if (this.detector.detect(coord)) {
            if (this.detector.pan() !== 0 && this.canCapture(ev) &&
                (!this.gestute || this.gestute.capture())) {
                this.onDragStart(ev);
                this.captured = true;
                return;
            }
            // Detection/capturing was not successful, aborting!
            this.started = false;
            this.captured = false;
            this.pointerEvents.stop();
            this.notCaptured(ev);
        }
    };
    PanGesture.prototype.pointerUp = function (ev) {
        if (!this.started) {
            return;
        }
        this.gestute && this.gestute.release();
        if (this.captured) {
            this.onDragEnd(ev);
        }
        else {
            this.notCaptured(ev);
        }
        this.captured = false;
        this.started = false;
    };
    PanGesture.prototype.getNativeElement = function () {
        return this.element;
    };
    // Implemented in a subclass
    PanGesture.prototype.canStart = function (ev) { return true; };
    PanGesture.prototype.canCapture = function (ev) { return true; };
    PanGesture.prototype.onDragStart = function (ev) { };
    PanGesture.prototype.onDragMove = function (ev) { };
    PanGesture.prototype.onDragEnd = function (ev) { };
    PanGesture.prototype.notCaptured = function (ev) { };
    return PanGesture;
}());
exports.PanGesture = PanGesture;
