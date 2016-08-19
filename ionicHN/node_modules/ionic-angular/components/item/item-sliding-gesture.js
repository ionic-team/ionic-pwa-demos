"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var dom_1 = require('../../util/dom');
var drag_gesture_1 = require('../../gestures/drag-gesture');
var DRAG_THRESHOLD = 10;
var MAX_ATTACK_ANGLE = 20;
var ItemSlidingGesture = (function (_super) {
    __extends(ItemSlidingGesture, _super);
    function ItemSlidingGesture(list) {
        _super.call(this, list.getNativeElement(), {
            maxAngle: MAX_ATTACK_ANGLE,
            threshold: DRAG_THRESHOLD,
            gesture: list._gestureCtrl.create('item-sliding', {
                priority: -10 /* SlidingItem */,
            })
        });
        this.list = list;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    }
    ItemSlidingGesture.prototype.canStart = function (ev) {
        if (this.selectedContainer) {
            return false;
        }
        // Get swiped sliding container
        var container = getContainer(ev);
        if (!container) {
            this.closeOpened();
            return false;
        }
        // Close open container if it is not the selected one.
        if (container !== this.openContainer) {
            this.closeOpened();
        }
        var coord = dom_1.pointerCoord(ev);
        this.preSelectedContainer = container;
        this.firstCoordX = coord.x;
        this.firstTimestamp = Date.now();
        return true;
    };
    ItemSlidingGesture.prototype.onDragStart = function (ev) {
        ev.preventDefault();
        var coord = dom_1.pointerCoord(ev);
        this.selectedContainer = this.openContainer = this.preSelectedContainer;
        this.selectedContainer.startSliding(coord.x);
    };
    ItemSlidingGesture.prototype.onDragMove = function (ev) {
        ev.preventDefault();
        var coordX = dom_1.pointerCoord(ev).x;
        this.selectedContainer.moveSliding(coordX);
    };
    ItemSlidingGesture.prototype.onDragEnd = function (ev) {
        ev.preventDefault();
        var coordX = dom_1.pointerCoord(ev).x;
        var deltaX = (coordX - this.firstCoordX);
        var deltaT = (Date.now() - this.firstTimestamp);
        var openAmount = this.selectedContainer.endSliding(deltaX / deltaT);
        this.selectedContainer = null;
        this.preSelectedContainer = null;
    };
    ItemSlidingGesture.prototype.notCaptured = function (ev) {
        this.closeOpened();
    };
    ItemSlidingGesture.prototype.closeOpened = function () {
        this.selectedContainer = null;
        if (this.openContainer) {
            this.openContainer.close();
            this.openContainer = null;
            return true;
        }
        return false;
    };
    ItemSlidingGesture.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
        this.closeOpened();
        this.list = null;
        this.preSelectedContainer = null;
        this.selectedContainer = null;
        this.openContainer = null;
    };
    return ItemSlidingGesture;
}(drag_gesture_1.PanGesture));
exports.ItemSlidingGesture = ItemSlidingGesture;
function getContainer(ev) {
    var ele = dom_1.closest(ev.target, 'ion-item-sliding', true);
    if (ele) {
        return ele['$ionComponent'];
    }
    return null;
}
