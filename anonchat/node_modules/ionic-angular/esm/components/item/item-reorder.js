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
import { Component, Directive, ElementRef, EventEmitter, forwardRef, Input, NgZone, Renderer, Inject, Optional, Output } from '@angular/core';
import { Content } from '../content/content';
import { CSS } from '../../util/dom';
import { Item } from './item';
import { ItemReorderGesture } from '../item/item-reorder-gesture';
import { isTrueProperty } from '../../util/util';
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
export var ItemReorder = function () {
    function ItemReorder(elementRef, _rendered, _zone, _content) {
        _classCallCheck(this, ItemReorder);

        this._rendered = _rendered;
        this._zone = _zone;
        this._content = _content;
        this._enableReorder = false;
        this._lastToIndex = -1;
        /**
         * @output {object} The expression to evaluate when the item is reordered. Emits an object
         * with `from` and `to` properties.
         */
        this.ionItemReorder = new EventEmitter();
        this._element = elementRef.nativeElement;
    }
    /**
     * @private
     */


    _createClass(ItemReorder, [{
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
            this._element = null;
            this._reorderGesture && this._reorderGesture.destroy();
        }
        /**
         * @private
         */

    }, {
        key: "reorderPrepare",

        /**
         * @private
         */
        value: function reorderPrepare() {
            var children = this._element.children;
            var len = children.length;
            for (var i = 0; i < len; i++) {
                children[i]['$ionIndex'] = i;
            }
        }
        /**
         * @private
         */

    }, {
        key: "reorderStart",
        value: function reorderStart() {
            this.setCssClass('reorder-list-active', true);
        }
        /**
         * @private
         */

    }, {
        key: "reorderEmit",
        value: function reorderEmit(fromIndex, toIndex) {
            var _this = this;

            this.reorderReset();
            if (fromIndex !== toIndex) {
                this._zone.run(function () {
                    _this.ionItemReorder.emit({
                        from: fromIndex,
                        to: toIndex
                    });
                });
            }
        }
        /**
         * @private
         */

    }, {
        key: "scrollContent",
        value: function scrollContent(scroll) {
            var scrollTop = this._content.getScrollTop() + scroll;
            if (scroll !== 0) {
                this._content.scrollTo(0, scrollTop, 0);
            }
            return scrollTop;
        }
        /**
         * @private
         */

    }, {
        key: "reorderReset",
        value: function reorderReset() {
            var children = this._element.children;
            var len = children.length;
            this.setCssClass('reorder-list-active', false);
            var transform = CSS.transform;
            for (var i = 0; i < len; i++) {
                children[i].style[transform] = '';
            }
            this._lastToIndex = -1;
        }
        /**
         * @private
         */

    }, {
        key: "reorderMove",
        value: function reorderMove(fromIndex, toIndex, itemHeight) {
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
            var transform = CSS.transform;
            if (toIndex >= lastToIndex) {
                for (var i = lastToIndex; i <= toIndex; i++) {
                    if (i !== fromIndex) {
                        children[i].style[transform] = i > fromIndex ? "translateY(" + -itemHeight + "px)" : '';
                    }
                }
            }
            if (toIndex <= lastToIndex) {
                for (var i = toIndex; i <= lastToIndex; i++) {
                    if (i !== fromIndex) {
                        children[i].style[transform] = i < fromIndex ? "translateY(" + itemHeight + "px)" : '';
                    }
                }
            }
        }
        /**
         * @private
         */

    }, {
        key: "setCssClass",
        value: function setCssClass(classname, add) {
            this._rendered.setElementClass(this._element, classname, add);
        }
        /**
         * @private
         */

    }, {
        key: "getNativeElement",
        value: function getNativeElement() {
            return this._element;
        }
    }, {
        key: "reorder",
        get: function get() {
            return this._enableReorder;
        },
        set: function set(val) {
            this._enableReorder = isTrueProperty(val);
            if (!this._enableReorder) {
                this._reorderGesture && this._reorderGesture.destroy();
                this._reorderGesture = null;
            } else if (!this._reorderGesture) {
                console.debug('enableReorderItems');
                this._reorderGesture = new ItemReorderGesture(this);
            }
        }
    }]);

    return ItemReorder;
}();
__decorate([Output(), __metadata('design:type', typeof (_a = typeof EventEmitter !== 'undefined' && EventEmitter) === 'function' && _a || Object)], ItemReorder.prototype, "ionItemReorder", void 0);
__decorate([Input(), __metadata('design:type', Boolean)], ItemReorder.prototype, "reorder", null);
ItemReorder = __decorate([Directive({
    selector: 'ion-list[reorder],ion-item-group[reorder]',
    host: {
        '[class.reorder-enabled]': '_enableReorder'
    }
}), __param(3, Optional()), __metadata('design:paramtypes', [typeof (_b = typeof ElementRef !== 'undefined' && ElementRef) === 'function' && _b || Object, typeof (_c = typeof Renderer !== 'undefined' && Renderer) === 'function' && _c || Object, typeof (_d = typeof NgZone !== 'undefined' && NgZone) === 'function' && _d || Object, typeof (_e = typeof Content !== 'undefined' && Content) === 'function' && _e || Object])], ItemReorder);
/**
 * @private
 */
export var Reorder = function () {
    function Reorder(item, elementRef) {
        _classCallCheck(this, Reorder);

        this.item = item;
        this.elementRef = elementRef;
        elementRef.nativeElement['$ionComponent'] = this;
    }

    _createClass(Reorder, [{
        key: "getReorderNode",
        value: function getReorderNode() {
            var node = this.item.getNativeElement();
            return findReorderItem(node);
        }
    }]);

    return Reorder;
}();
Reorder = __decorate([Component({
    selector: 'ion-reorder',
    template: "<ion-icon name=\"menu\"></ion-icon>"
}), __param(0, Inject(forwardRef(function () {
    return Item;
}))), __metadata('design:paramtypes', [typeof (_f = typeof Item !== 'undefined' && Item) === 'function' && _f || Object, typeof (_g = typeof ElementRef !== 'undefined' && ElementRef) === 'function' && _g || Object])], Reorder);
/**
 * @private
 */
export function findReorderItem(node) {
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
/**
 * @private
 */
export function indexForItem(element) {
    return element['$ionIndex'];
}
var _a, _b, _c, _d, _e, _f, _g;