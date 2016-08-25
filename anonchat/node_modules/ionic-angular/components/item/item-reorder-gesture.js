"use strict";
var item_reorder_1 = require('../item/item-reorder');
var ui_event_manager_1 = require('../../util/ui-event-manager');
var dom_1 = require('../../util/dom');
var AUTO_SCROLL_MARGIN = 60;
var SCROLL_JUMP = 10;
var ITEM_REORDER_ACTIVE = 'reorder-active';
/**
 * @private
 */
var ItemReorderGesture = (function () {
    function ItemReorderGesture(reorderList) {
        this.reorderList = reorderList;
        this.selectedItemEle = null;
        this.events = new ui_event_manager_1.UIEventManager(false);
        this.events.pointerEvents({
            element: this.reorderList.getNativeElement(),
            pointerDown: this.onDragStart.bind(this),
            pointerMove: this.onDragMove.bind(this),
            pointerUp: this.onDragEnd.bind(this)
        });
    }
    ItemReorderGesture.prototype.onDragStart = function (ev) {
        var reorderElement = ev.target;
        if (reorderElement.nodeName !== 'ION-REORDER') {
            return false;
        }
        var reorderMark = reorderElement['$ionComponent'];
        if (!reorderMark) {
            void 0;
            return false;
        }
        this.reorderList.reorderPrepare();
        var item = reorderMark.getReorderNode();
        if (!item) {
            void 0;
            return false;
        }
        ev.preventDefault();
        // Preparing state
        this.selectedItemEle = item;
        this.selectedItemHeight = item.offsetHeight;
        this.lastYcoord = -100;
        this.lastToIndex = item_reorder_1.indexForItem(item);
        this.windowHeight = window.innerHeight - AUTO_SCROLL_MARGIN;
        this.lastScrollPosition = this.reorderList.scrollContent(0);
        this.offset = dom_1.pointerCoord(ev);
        this.offset.y += this.lastScrollPosition;
        item.classList.add(ITEM_REORDER_ACTIVE);
        this.reorderList.reorderStart();
        return true;
    };
    ItemReorderGesture.prototype.onDragMove = function (ev) {
        var selectedItem = this.selectedItemEle;
        if (!selectedItem) {
            return;
        }
        ev.preventDefault();
        // Get coordinate
        var coord = dom_1.pointerCoord(ev);
        var posY = coord.y;
        // Scroll if we reach the scroll margins
        var scrollPosition = this.scroll(posY);
        // Only perform hit test if we moved at least 30px from previous position
        if (Math.abs(posY - this.lastYcoord) > 30) {
            var overItem = this.itemForCoord(coord);
            if (overItem) {
                var toIndex = item_reorder_1.indexForItem(overItem);
                if (toIndex !== undefined && (toIndex !== this.lastToIndex || this.emptyZone)) {
                    var fromIndex = item_reorder_1.indexForItem(this.selectedItemEle);
                    this.lastToIndex = toIndex;
                    this.lastYcoord = posY;
                    this.emptyZone = false;
                    this.reorderList.reorderMove(fromIndex, toIndex, this.selectedItemHeight);
                }
            }
            else {
                this.emptyZone = true;
            }
        }
        // Update selected item position
        var ydiff = Math.round(posY - this.offset.y + scrollPosition);
        selectedItem.style[dom_1.CSS.transform] = "translateY(" + ydiff + "px)";
    };
    ItemReorderGesture.prototype.onDragEnd = function () {
        var _this = this;
        if (!this.selectedItemEle) {
            return;
        }
        var toIndex = this.lastToIndex;
        var fromIndex = item_reorder_1.indexForItem(this.selectedItemEle);
        var reorderInactive = function () {
            _this.selectedItemEle.style.transition = '';
            _this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
            _this.selectedItemEle = null;
        };
        if (toIndex === fromIndex) {
            this.selectedItemEle.style.transition = 'transform 200ms ease-in-out';
            setTimeout(reorderInactive, 200);
        }
        else {
            reorderInactive();
        }
        this.reorderList.reorderEmit(fromIndex, toIndex);
    };
    ItemReorderGesture.prototype.itemForCoord = function (coord) {
        return itemForPosition(this.offset.x - 100, coord.y);
    };
    ItemReorderGesture.prototype.scroll = function (posY) {
        if (posY < AUTO_SCROLL_MARGIN) {
            this.lastScrollPosition = this.reorderList.scrollContent(-SCROLL_JUMP);
        }
        else if (posY > this.windowHeight) {
            this.lastScrollPosition = this.reorderList.scrollContent(SCROLL_JUMP);
        }
        return this.lastScrollPosition;
    };
    /**
     * @private
     */
    ItemReorderGesture.prototype.destroy = function () {
        this.onDragEnd();
        this.events.unlistenAll();
        this.events = null;
        this.reorderList = null;
    };
    return ItemReorderGesture;
}());
exports.ItemReorderGesture = ItemReorderGesture;
function itemForPosition(x, y) {
    var element = document.elementFromPoint(x, y);
    return item_reorder_1.findReorderItem(element);
}
