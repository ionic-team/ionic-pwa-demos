var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

import { indexForItem, findReorderItem } from '../item/item-reorder';
import { UIEventManager } from '../../util/ui-event-manager';
import { pointerCoord, CSS } from '../../util/dom';
var AUTO_SCROLL_MARGIN = 60;
var SCROLL_JUMP = 10;
var ITEM_REORDER_ACTIVE = 'reorder-active';
/**
 * @private
 */
export var ItemReorderGesture = function () {
    function ItemReorderGesture(reorderList) {
        _classCallCheck(this, ItemReorderGesture);

        this.reorderList = reorderList;
        this.selectedItemEle = null;
        this.events = new UIEventManager(false);
        this.events.pointerEvents({
            element: this.reorderList.getNativeElement(),
            pointerDown: this.onDragStart.bind(this),
            pointerMove: this.onDragMove.bind(this),
            pointerUp: this.onDragEnd.bind(this)
        });
    }

    _createClass(ItemReorderGesture, [{
        key: 'onDragStart',
        value: function onDragStart(ev) {
            var reorderElement = ev.target;
            if (reorderElement.nodeName !== 'ION-REORDER') {
                return false;
            }
            var reorderMark = reorderElement['$ionComponent'];
            if (!reorderMark) {
                console.error('ion-reorder does not contain $ionComponent');
                return false;
            }
            this.reorderList.reorderPrepare();
            var item = reorderMark.getReorderNode();
            if (!item) {
                console.error('reorder node not found');
                return false;
            }
            ev.preventDefault();
            // Preparing state
            this.selectedItemEle = item;
            this.selectedItemHeight = item.offsetHeight;
            this.lastYcoord = -100;
            this.lastToIndex = indexForItem(item);
            this.windowHeight = window.innerHeight - AUTO_SCROLL_MARGIN;
            this.lastScrollPosition = this.reorderList.scrollContent(0);
            this.offset = pointerCoord(ev);
            this.offset.y += this.lastScrollPosition;
            item.classList.add(ITEM_REORDER_ACTIVE);
            this.reorderList.reorderStart();
            return true;
        }
    }, {
        key: 'onDragMove',
        value: function onDragMove(ev) {
            var selectedItem = this.selectedItemEle;
            if (!selectedItem) {
                return;
            }
            ev.preventDefault();
            // Get coordinate
            var coord = pointerCoord(ev);
            var posY = coord.y;
            // Scroll if we reach the scroll margins
            var scrollPosition = this.scroll(posY);
            // Only perform hit test if we moved at least 30px from previous position
            if (Math.abs(posY - this.lastYcoord) > 30) {
                var overItem = this.itemForCoord(coord);
                if (overItem) {
                    var toIndex = indexForItem(overItem);
                    if (toIndex !== undefined && (toIndex !== this.lastToIndex || this.emptyZone)) {
                        var fromIndex = indexForItem(this.selectedItemEle);
                        this.lastToIndex = toIndex;
                        this.lastYcoord = posY;
                        this.emptyZone = false;
                        this.reorderList.reorderMove(fromIndex, toIndex, this.selectedItemHeight);
                    }
                } else {
                    this.emptyZone = true;
                }
            }
            // Update selected item position
            var ydiff = Math.round(posY - this.offset.y + scrollPosition);
            selectedItem.style[CSS.transform] = 'translateY(' + ydiff + 'px)';
        }
    }, {
        key: 'onDragEnd',
        value: function onDragEnd() {
            var _this = this;

            if (!this.selectedItemEle) {
                return;
            }
            var toIndex = this.lastToIndex;
            var fromIndex = indexForItem(this.selectedItemEle);
            var reorderInactive = function reorderInactive() {
                _this.selectedItemEle.style.transition = '';
                _this.selectedItemEle.classList.remove(ITEM_REORDER_ACTIVE);
                _this.selectedItemEle = null;
            };
            if (toIndex === fromIndex) {
                this.selectedItemEle.style.transition = 'transform 200ms ease-in-out';
                setTimeout(reorderInactive, 200);
            } else {
                reorderInactive();
            }
            this.reorderList.reorderEmit(fromIndex, toIndex);
        }
    }, {
        key: 'itemForCoord',
        value: function itemForCoord(coord) {
            return itemForPosition(this.offset.x - 100, coord.y);
        }
    }, {
        key: 'scroll',
        value: function scroll(posY) {
            if (posY < AUTO_SCROLL_MARGIN) {
                this.lastScrollPosition = this.reorderList.scrollContent(-SCROLL_JUMP);
            } else if (posY > this.windowHeight) {
                this.lastScrollPosition = this.reorderList.scrollContent(SCROLL_JUMP);
            }
            return this.lastScrollPosition;
        }
        /**
         * @private
         */

    }, {
        key: 'destroy',
        value: function destroy() {
            this.onDragEnd();
            this.events.unlistenAll();
            this.events = null;
            this.reorderList = null;
        }
    }]);

    return ItemReorderGesture;
}();
function itemForPosition(x, y) {
    var element = document.elementFromPoint(x, y);
    return findReorderItem(element);
}