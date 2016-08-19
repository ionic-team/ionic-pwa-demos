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
import { forwardRef, Inject, Injectable } from '@angular/core';
import { App } from '../components/app/app';
export var GesturePriority;
(function (GesturePriority) {
    GesturePriority[GesturePriority["Minimun"] = -10000] = "Minimun";
    GesturePriority[GesturePriority["VeryLow"] = -20] = "VeryLow";
    GesturePriority[GesturePriority["Low"] = -10] = "Low";
    GesturePriority[GesturePriority["Normal"] = 0] = "Normal";
    GesturePriority[GesturePriority["High"] = 10] = "High";
    GesturePriority[GesturePriority["VeryHigh"] = 20] = "VeryHigh";
    GesturePriority[GesturePriority["SlidingItem"] = -10] = "SlidingItem";
    GesturePriority[GesturePriority["MenuSwipe"] = 10] = "MenuSwipe";
    GesturePriority[GesturePriority["GoBackSwipe"] = 20] = "GoBackSwipe";
    GesturePriority[GesturePriority["Refresher"] = 0] = "Refresher";
})(GesturePriority || (GesturePriority = {}));
export var DisableScroll;
(function (DisableScroll) {
    DisableScroll[DisableScroll["Never"] = 0] = "Never";
    DisableScroll[DisableScroll["DuringCapture"] = 1] = "DuringCapture";
    DisableScroll[DisableScroll["Always"] = 2] = "Always";
})(DisableScroll || (DisableScroll = {}));
export var GestureController = function () {
    function GestureController(_app) {
        _classCallCheck(this, GestureController);

        this._app = _app;
        this.id = 1;
        this.requestedStart = {};
        this.disabledGestures = {};
        this.disabledScroll = new Set();
        this.capturedID = null;
    }

    _createClass(GestureController, [{
        key: "create",
        value: function create(name) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            return new GestureDelegate(name, this.newID(), this, opts);
        }
    }, {
        key: "newID",
        value: function newID() {
            var id = this.id;
            this.id++;
            return id;
        }
    }, {
        key: "start",
        value: function start(gestureName, id, priority) {
            if (!this.canStart(gestureName)) {
                delete this.requestedStart[id];
                return false;
            }
            this.requestedStart[id] = priority;
            return true;
        }
    }, {
        key: "capture",
        value: function capture(gestureName, id, priority) {
            if (!this.start(gestureName, id, priority)) {
                return false;
            }
            var requestedStart = this.requestedStart;
            var maxPriority = GesturePriority.Minimun;
            for (var gestureID in requestedStart) {
                maxPriority = Math.max(maxPriority, requestedStart[gestureID]);
            }
            if (maxPriority === priority) {
                this.capturedID = id;
                this.requestedStart = {};
                return true;
            }
            delete requestedStart[id];
            console.debug(gestureName + " can not start because it is has lower priority");
            return false;
        }
    }, {
        key: "release",
        value: function release(id) {
            delete this.requestedStart[id];
            if (this.capturedID && id === this.capturedID) {
                this.capturedID = null;
            }
        }
    }, {
        key: "disableGesture",
        value: function disableGesture(gestureName, id) {
            var set = this.disabledGestures[gestureName];
            if (!set) {
                set = new Set();
                this.disabledGestures[gestureName] = set;
            }
            set.add(id);
        }
    }, {
        key: "enableGesture",
        value: function enableGesture(gestureName, id) {
            var set = this.disabledGestures[gestureName];
            if (set) {
                set.delete(id);
            }
        }
    }, {
        key: "disableScroll",
        value: function disableScroll(id) {
            var isEnabled = !this.isScrollDisabled();
            this.disabledScroll.add(id);
            if (this._app && isEnabled && this.isScrollDisabled()) {
                console.debug('GestureController: Disabling scrolling');
                this._app.setScrollDisabled(true);
            }
        }
    }, {
        key: "enableScroll",
        value: function enableScroll(id) {
            var isDisabled = this.isScrollDisabled();
            this.disabledScroll.delete(id);
            if (this._app && isDisabled && !this.isScrollDisabled()) {
                console.debug('GestureController: Enabling scrolling');
                this._app.setScrollDisabled(false);
            }
        }
    }, {
        key: "canStart",
        value: function canStart(gestureName) {
            if (this.capturedID) {
                // a gesture already captured
                return false;
            }
            if (this.isDisabled(gestureName)) {
                return false;
            }
            return true;
        }
    }, {
        key: "isCaptured",
        value: function isCaptured() {
            return !!this.capturedID;
        }
    }, {
        key: "isScrollDisabled",
        value: function isScrollDisabled() {
            return this.disabledScroll.size > 0;
        }
    }, {
        key: "isDisabled",
        value: function isDisabled(gestureName) {
            var disabled = this.disabledGestures[gestureName];
            if (disabled && disabled.size > 0) {
                return true;
            }
            return false;
        }
    }]);

    return GestureController;
}();
GestureController = __decorate([Injectable(), __param(0, Inject(forwardRef(function () {
    return App;
}))), __metadata('design:paramtypes', [typeof (_a = typeof App !== 'undefined' && App) === 'function' && _a || Object])], GestureController);
export var GestureDelegate = function () {
    function GestureDelegate(name, id, controller, opts) {
        _classCallCheck(this, GestureDelegate);

        this.name = name;
        this.id = id;
        this.controller = controller;
        this.priority = 0;
        this.disable = opts.disable || [];
        this.disableScroll = opts.disableScroll || DisableScroll.Never;
        this.priority = opts.priority || 0;
        // Disable gestures
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = this.disable[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var gestureName = _step.value;

                controller.disableGesture(gestureName, id);
            }
            // Disable scrolling (always)
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

        if (this.disableScroll === DisableScroll.Always) {
            controller.disableScroll(id);
        }
    }

    _createClass(GestureDelegate, [{
        key: "canStart",
        value: function canStart() {
            if (!this.controller) {
                return false;
            }
            return this.controller.canStart(this.name);
        }
    }, {
        key: "start",
        value: function start() {
            if (!this.controller) {
                return false;
            }
            return this.controller.start(this.name, this.id, this.priority);
        }
    }, {
        key: "capture",
        value: function capture() {
            if (!this.controller) {
                return false;
            }
            var captured = this.controller.capture(this.name, this.id, this.priority);
            if (captured && this.disableScroll === DisableScroll.DuringCapture) {
                this.controller.disableScroll(this.id);
            }
            return captured;
        }
    }, {
        key: "release",
        value: function release() {
            if (!this.controller) {
                return;
            }
            this.controller.release(this.id);
            if (this.disableScroll === DisableScroll.DuringCapture) {
                this.controller.enableScroll(this.id);
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            if (!this.controller) {
                return;
            }
            this.release();
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.disable[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var disabled = _step2.value;

                    this.controller.enableGesture(disabled, this.id);
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            if (this.disableScroll === DisableScroll.Always) {
                this.controller.enableScroll(this.id);
            }
            this.controller = null;
        }
    }]);

    return GestureDelegate;
}();
var _a;