"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var util_1 = require('../../util/util');
var slide_edge_gesture_1 = require('../../gestures/slide-edge-gesture');
var SwipeBackGesture = (function (_super) {
    __extends(SwipeBackGesture, _super);
    function SwipeBackGesture(element, options, _nav, gestureCtlr) {
        _super.call(this, element, util_1.assign({
            direction: 'x',
            maxEdgeStart: 75,
            gesture: gestureCtlr.create('goback-swipe', {
                priority: 20 /* GoBackSwipe */,
            })
        }, options));
        this._nav = _nav;
    }
    SwipeBackGesture.prototype.canStart = function (ev) {
        // the gesture swipe angle must be mainly horizontal and the
        // gesture distance would be relatively short for a swipe back
        // and swipe back must be possible on this nav controller
        return (this._nav.canSwipeBack() &&
            _super.prototype.canStart.call(this, ev));
    };
    SwipeBackGesture.prototype.onSlideBeforeStart = function (slideData, ev) {
        void 0;
        this._nav.swipeBackStart();
    };
    SwipeBackGesture.prototype.onSlide = function (slide) {
        var stepValue = (slide.distance / slide.max);
        void 0;
        this._nav.swipeBackProgress(stepValue);
    };
    SwipeBackGesture.prototype.onSlideEnd = function (slide, ev) {
        var shouldComplete = (Math.abs(slide.velocity) > 0.2 || Math.abs(slide.delta) > Math.abs(slide.max) * 0.5);
        var currentStepValue = (slide.distance / slide.max);
        void 0;
        this._nav.swipeBackEnd(shouldComplete, currentStepValue);
    };
    return SwipeBackGesture;
}(slide_edge_gesture_1.SlideEdgeGesture));
exports.SwipeBackGesture = SwipeBackGesture;
