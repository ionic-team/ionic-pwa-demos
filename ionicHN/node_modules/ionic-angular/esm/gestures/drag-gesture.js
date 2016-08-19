var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { defaults } from '../util';
import { UIEventManager } from '../util/ui-event-manager';
import { PanRecognizer } from './recognizers';
import { pointerCoord } from '../util/dom';
/**
 * @private
 */
export var PanGesture = function () {
    function PanGesture(element) {
        var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, PanGesture);

        this.element = element;
        this.events = new UIEventManager(false);
        this.started = false;
        this.captured = false;
        this.isListening = false;
        defaults(opts, {
            threshold: 20,
            maxAngle: 40,
            direction: 'x'
        });
        this.gestute = opts.gesture;
        this.direction = opts.direction;
        this.detector = new PanRecognizer(opts.direction, opts.threshold, opts.maxAngle);
    }

    _createClass(PanGesture, [{
        key: 'listen',
        value: function listen() {
            if (!this.isListening) {
                this.pointerEvents = this.events.pointerEvents({
                    element: this.element,
                    pointerDown: this.pointerDown.bind(this),
                    pointerMove: this.pointerMove.bind(this),
                    pointerUp: this.pointerUp.bind(this)
                });
                this.isListening = true;
            }
        }
    }, {
        key: 'unlisten',
        value: function unlisten() {
            this.gestute && this.gestute.release();
            this.events.unlistenAll();
            this.isListening = false;
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.gestute && this.gestute.destroy();
            this.unlisten();
            this.element = null;
        }
    }, {
        key: 'pointerDown',
        value: function pointerDown(ev) {
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
            var coord = pointerCoord(ev);
            this.detector.start(coord);
            this.started = true;
            this.captured = false;
            return true;
        }
    }, {
        key: 'pointerMove',
        value: function pointerMove(ev) {
            if (!this.started) {
                return;
            }
            if (this.captured) {
                this.onDragMove(ev);
                return;
            }
            var coord = pointerCoord(ev);
            if (this.detector.detect(coord)) {
                if (this.detector.pan() !== 0 && this.canCapture(ev) && (!this.gestute || this.gestute.capture())) {
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
        }
    }, {
        key: 'pointerUp',
        value: function pointerUp(ev) {
            if (!this.started) {
                return;
            }
            this.gestute && this.gestute.release();
            if (this.captured) {
                this.onDragEnd(ev);
            } else {
                this.notCaptured(ev);
            }
            this.captured = false;
            this.started = false;
        }
    }, {
        key: 'getNativeElement',
        value: function getNativeElement() {
            return this.element;
        }
        // Implemented in a subclass

    }, {
        key: 'canStart',
        value: function canStart(ev) {
            return true;
        }
    }, {
        key: 'canCapture',
        value: function canCapture(ev) {
            return true;
        }
    }, {
        key: 'onDragStart',
        value: function onDragStart(ev) {}
    }, {
        key: 'onDragMove',
        value: function onDragMove(ev) {}
    }, {
        key: 'onDragEnd',
        value: function onDragEnd(ev) {}
    }, {
        key: 'notCaptured',
        value: function notCaptured(ev) {}
    }]);

    return PanGesture;
}();