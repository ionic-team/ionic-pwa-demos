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
var content_1 = require('../content/content');
var dom_1 = require('../../util/dom');
var item_1 = require('./item');
var item_reorder_gesture_1 = require('../item/item-reorder-gesture');
var util_1 = require('../../util/util');
/**
 * @name ItemReorder
 * @description
 * Item reorder adds the ability to change an item's order in a group.
 * It can be used within an `ion-list` or `ion-item-group` to provide a
 * visual drag and drop interface.
 *
 * ## Grouping Items
 *
 * All reorderable items must be grouped in the same element. If an item
 * should not be reordered, it shouldn't be included in this group. For
 * example, the following code works because the items are grouped in the
 * `<ion-list>`:
 *
 *  ```html
 *  <ion-list reorder="true">
 *    <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *  </ion-list>
 *  ```
 *
 * However, the below list includes a header that shouldn't be reordered:
 *
 *  ```html
 *  <ion-list reorder="true">
 *    <ion-list-header>Header</ion-list-header>
 *    <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *  </ion-list>
 *  ```
 *
 * In order to mix different sets of items, `ion-item-group` should be used to
 * group the reorderable items:
 *
 *  ```html
 *  <ion-list>
 *    <ion-list-header>Header</ion-list-header>
 *    <ion-item-group reorder="true">
 *      <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *    </ion-item-group>
 *  </ion-list>
 *  ```
 *
 * It's important to note that in this example, the `[reorder]` directive is applied to
 * the `<ion-item-group>` instead of the `<ion-list>`. This way makes it possible to
 * mix items that should and shouldn't be reordered.
 *
 *
 * ## Implementing the Reorder Function
 *
 * When the item is dragged and dropped into the new position, the `(ionItemReorder)` event is
 * emitted. This event provides the initial index (from) and the new index (to) of the reordered
 * item. For example, if the first item is dragged to the fifth position, the event will emit
 * `{from: 0, to: 4}`. Note that the index starts at zero.
 *
 * A function should be called when the event is emitted that handles the reordering of the items.
 * See [usage](#usage) below for some examples.
 *
 *
 * @usage
 *
 * ```html
 * <ion-list>
 *   <ion-list-header>Header</ion-list-header>
 *   <ion-item-group reorder="true" (ionItemReorder)="reorderItems($event)">
 *     <ion-item *ngFor="let item of items">{% raw %}{{ item }}{% endraw %}</ion-item>
 *   </ion-item-group>
 * </ion-list>
 * ```
 *
 * ```ts
 * class MyComponent {
 *   items = [];
 *
 *   constructor() {
 *     for (let x = 0; x < 5; x++) {
 *       this.items.push(x);
 *     }
 *   }
 *
 *   reorderItems(indexes) {
 *     let element = this.items[indexes.from];
 *     this.items.splice(indexes.from, 1);
 *     this.items.splice(indexes.to, 0, element);
 *   }
 * }
 * ```
 *
 * Ionic also provides a helper function called `reorderArray` to
 * reorder the array of items. This can be used instead:
 *
 * ```ts
 * import { reorderArray } from 'ionic-angular';
 *
 * class MyComponent {
 *   items = [];
 *
 *   constructor() {
 *     for (let x = 0; x < 5; x++) {
 *       this.items.push(x);
 *     }
 *   }
 *
 *   reorderItems(indexes) {
 *     this.items = reorderArray(this.items, indexes);
 *   }
 * }
 * ```
 *
 * @demo /docs/v2/demos/item-reorder/
 * @see {@link /docs/v2/components#lists List Component Docs}
 * @see {@link ../../list/List List API Docs}
 * @see {@link ../Item Item API Docs}
 */
var ItemReorder = (function () {
    function ItemReorder(elementRef, _rendered, _zone, _content) {
        this._rendered = _rendered;
        this._zone = _zone;
        this._content = _content;
        this._enableReorder = false;
        this._lastToIndex = -1;
        /**
         * @output {object} The expression to evaluate when the item is reordered. Emits an object
         * with `from` and `to` properties.
         */
        this.ionItemReorder = new core_1.EventEmitter();
        this._element = elementRef.nativeElement;
    }
    /**
     * @private
     */
    ItemReorder.prototype.ngOnDestroy = function () {
        this._element = null;
        this._reorderGesture && this._reorderGesture.destroy();
    };
    Object.defineProperty(ItemReorder.prototype, "reorder", {
        /**
         * @private
         */
        get: function () {
            return this._enableReorder;
        },
        set: function (val) {
            this._enableReorder = util_1.isTrueProperty(val);
            if (!this._enableReorder) {
                this._reorderGesture && this._reorderGesture.destroy();
                this._reorderGesture = null;
            }
            else if (!this._reorderGesture) {
                void 0;
                this._reorderGesture = new item_reorder_gesture_1.ItemReorderGesture(this);
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    ItemReorder.prototype.reorderPrepare = function () {
        var children = this._element.children;
        var len = children.length;
        for (var i = 0; i < len; i++) {
            children[i]['$ionIndex'] = i;
        }
    };
    /**
     * @private
     */
    ItemReorder.prototype.reorderStart = function () {
        this.setCssClass('reorder-list-active', true);
    };
    /**
     * @private
     */
    ItemReorder.prototype.reorderEmit = function (fromIndex, toIndex) {
        var _this = this;
        this.reorderReset();
        if (fromIndex !== toIndex) {
            this._zone.run(function () {
                _this.ionItemReorder.emit({
                    from: fromIndex,
                    to: toIndex,
                });
            });
        }
    };
    /**
     * @private
     */
    ItemReorder.prototype.scrollContent = function (scroll) {
        var scrollTop = this._content.getScrollTop() + scroll;
        if (scroll !== 0) {
            this._content.scrollTo(0, scrollTop, 0);
        }
        return scrollTop;
    };
    /**
     * @private
     */
    ItemReorder.prototype.reorderReset = function () {
        var children = this._element.children;
        var len = children.length;
        this.setCssClass('reorder-list-active', false);
        var transform = dom_1.CSS.transform;
        for (var i = 0; i < len; i++) {
            children[i].style[transform] = '';
        }
        this._lastToIndex = -1;
    };
    /**
     * @private
     */
    ItemReorder.prototype.reorderMove = function (fromIndex, toIndex, itemHeight) {
        if (this._lastToIndex === -1) {
            this._lastToIndex = fromIndex;
        }
        var lastToIndex = this._lastToIndex;
        this._lastToIndex = toIndex;
        // TODO: I think both loops can be merged into a single one
        // but I had no luck last time I tried
        /********* DOM READ ********** */
        var children = this._element.children;
        /********* DOM WRITE ********* */
        var transform = dom_1.CSS.transform;
        if (toIndex >= lastToIndex) {
            for (var i = lastToIndex; i <= toIndex; i++) {
                if (i !== fromIndex) {
                    children[i].style[transform] = (i > fromIndex)
                        ? "translateY(" + -itemHeight + "px)" : '';
                }
            }
        }
        if (toIndex <= lastToIndex) {
            for (var i = toIndex; i <= lastToIndex; i++) {
                if (i !== fromIndex) {
                    children[i].style[transform] = (i < fromIndex)
                        ? "translateY(" + itemHeight + "px)" : '';
                }
            }
        }
    };
    /**
     * @private
     */
    ItemReorder.prototype.setCssClass = function (classname, add) {
        this._rendered.setElementClass(this._element, classname, add);
    };
    /**
     * @private
     */
    ItemReorder.prototype.getNativeElement = function () {
        return this._element;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], ItemReorder.prototype, "ionItemReorder", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ItemReorder.prototype, "reorder", null);
    ItemReorder = __decorate([
        core_1.Directive({
            selector: 'ion-list[reorder],ion-item-group[reorder]',
            host: {
                '[class.reorder-enabled]': '_enableReorder',
            }
        }),
        __param(3, core_1.Optional()), 
        __metadata('design:paramtypes', [core_1.ElementRef, core_1.Renderer, core_1.NgZone, content_1.Content])
    ], ItemReorder);
    return ItemReorder;
}());
exports.ItemReorder = ItemReorder;
/**
 * @private
 */
var Reorder = (function () {
    function Reorder(item, elementRef) {
        this.item = item;
        this.elementRef = elementRef;
        elementRef.nativeElement['$ionComponent'] = this;
    }
    Reorder.prototype.getReorderNode = function () {
        var node = this.item.getNativeElement();
        return findReorderItem(node);
    };
    Reorder = __decorate([
        core_1.Component({
            selector: 'ion-reorder',
            template: "<ion-icon name=\"menu\"></ion-icon>"
        }),
        __param(0, core_1.Inject(core_1.forwardRef(function () { return item_1.Item; }))), 
        __metadata('design:paramtypes', [item_1.Item, core_1.ElementRef])
    ], Reorder);
    return Reorder;
}());
exports.Reorder = Reorder;
/**
 * @private
 */
function findReorderItem(node) {
    var nested = 0;
    while (node && nested < 4) {
        if (indexForItem(node) !== undefined) {
            return node;
        }
        node = node.parentNode;
        nested++;
    }
    return null;
}
exports.findReorderItem = findReorderItem;
/**
 * @private
 */
function indexForItem(element) {
    return element['$ionIndex'];
}
exports.indexForItem = indexForItem;
