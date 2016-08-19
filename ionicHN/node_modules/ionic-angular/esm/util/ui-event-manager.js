var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @private
 */
export var PointerEvents = function () {
    function PointerEvents(ele, pointerDown, pointerMove, pointerUp, zone, option) {
        _classCallCheck(this, PointerEvents);

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

    _createClass(PointerEvents, [{
        key: 'handleTouchStart',
        value: function handleTouchStart(ev) {
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
        }
    }, {
        key: 'handleMouseDown',
        value: function handleMouseDown(ev) {
            if (this.lastTouchEvent > Date.now()) {
                console.debug('mousedown event dropped because of previous touch');
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
        }
    }, {
        key: 'handleTouchEnd',
        value: function handleTouchEnd(ev) {
            this.stopTouch();
            this.pointerUp(ev);
        }
    }, {
        key: 'handleMouseUp',
        value: function handleMouseUp(ev) {
            this.stopMouse();
            this.pointerUp(ev);
        }
    }, {
        key: 'stopTouch',
        value: function stopTouch() {
            this.rmTouchMove && this.rmTouchMove();
            this.rmTouchEnd && this.rmTouchEnd();
            this.rmTouchCancel && this.rmTouchCancel();
            this.rmTouchMove = null;
            this.rmTouchEnd = null;
            this.rmTouchCancel = null;
        }
    }, {
        key: 'stopMouse',
        value: function stopMouse() {
            this.rmMouseMove && this.rmMouseMove();
            this.rmMouseUp && this.rmMouseUp();
            this.rmMouseMove = null;
            this.rmMouseUp = null;
        }
    }, {
        key: 'stop',
        value: function stop() {
            this.stopTouch();
            this.stopMouse();
        }
    }, {
        key: 'destroy',
        value: function destroy() {
            this.rmTouchStart && this.rmTouchStart();
            this.rmTouchStart = null;
            this.rmMouseStart && this.rmMouseStart();
            this.rmMouseStart = null;
            this.stop();
            this.pointerDown = null;
            this.pointerMove = null;
            this.pointerUp = null;
            this.ele = null;
        }
    }]);

    return PointerEvents;
}();
/**
 * @private
 */
export var UIEventManager = function () {
    function UIEventManager() {
        var zoneWrapped = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

        _classCallCheck(this, UIEventManager);

        this.zoneWrapped = zoneWrapped;
        this.events = [];
    }

    _createClass(UIEventManager, [{
        key: 'listenRef',
        value: function listenRef(ref, eventName, callback, option) {
            return this.listen(ref.nativeElement, eventName, callback, option);
        }
    }, {
        key: 'pointerEvents',
        value: function pointerEvents(config) {
            var element = config.element;
            if (!element) {
                element = config.elementRef.nativeElement;
            }
            if (!element || !config.pointerDown || !config.pointerMove || !config.pointerUp) {
                console.error('PointerEvents config is invalid');
                return;
            }
            var zone = config.zone || this.zoneWrapped;
            var options = config.nativeOptions || false;
            var submanager = new PointerEvents(element, config.pointerDown, config.pointerMove, config.pointerUp, zone, options);
            var removeFunc = function removeFunc() {
                return submanager.destroy();
            };
            this.events.push(removeFunc);
            return submanager;
        }
    }, {
        key: 'listen',
        value: function listen(element, eventName, callback) {
            var option = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

            if (!element) {
                return;
            }
            var removeFunc = listenEvent(element, eventName, this.zoneWrapped, option, callback);
            this.events.push(removeFunc);
            return removeFunc;
        }
    }, {
        key: 'unlistenAll',
        value: function unlistenAll() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var event = _step.value;

                    event();
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.events.length = 0;
        }
    }]);

    return UIEventManager;
}();
function listenEvent(ele, eventName, zoneWrapped, option, callback) {
    var rawEvent = '__zone_symbol__addEventListener' in ele && !zoneWrapped;
    if (rawEvent) {
        ele.__zone_symbol__addEventListener(eventName, callback, option);
        return function () {
            return ele.__zone_symbol__removeEventListener(eventName, callback);
        };
    } else {
        ele.addEventListener(eventName, callback, option);
        return function () {
            return ele.removeEventListener(eventName, callback);
        };
    }
}