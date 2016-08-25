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
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { Backdrop } from '../backdrop/backdrop';
import { Config } from '../../config/config';
import { isTrueProperty } from '../../util/util';
import { Keyboard } from '../../util/keyboard';
import { MenuContentGesture } from './menu-gestures';
import { MenuController } from './menu-controller';
import { Platform } from '../../platform/platform';
import { GestureController } from '../../gestures/gesture-controller';
/**
 * @name Menu
 * @description
 * The Menu component is a navigation drawer that slides in from the side of the current
 * view. By default, it slides in from the left, but the side can be overridden. The menu
 * will be displayed differently based on the mode, however the display type can be changed
 * to any of the available [menu types](#menu-types). The menu element should be a sibling
 * to the app's content element. There can be any number of menus attached to the content.
 * These can be controlled from the templates, or programmatically using the [MenuController](../MenuController).
 *
 *
 * ### Opening/Closing Menus
 *
 * There are several ways to open or close a menu. The menu can be **toggled** open or closed
 * from the template using the [MenuToggle](../MenuToggle) directive. It can also be
 * **closed** from the template using the [MenuClose](../MenuClose) directive. To display a menu
 * programmatically, inject the [MenuController](../MenuController) provider and call any of the
 * `MenuController` methods.
 *
 *
 * ### Menu Types
 *
 * The menu supports several display types: `overlay`, `reveal` and `push`. By default,
 * it will use the correct type based on the mode, but this can be changed. The default
 * type for both Material Design and Windows mode is `overlay`, and `reveal` is the default
 * type for iOS mode. The menu type can be changed in the app's [config](../../config/Config)
 * via the `menuType` property, or passed in the `type` property on the `<ion-menu>` element.
 * See [usage](#usage) below for examples of changing the menu type.
 *
 *
 * ### Navigation Bar Behavior
 *
 * If a [MenuToggle](../MenuToggle) button is added to the [NavBar](../../nav/NavBar) of
 * a page, the button will only appear when the page it's in is currently a root page. The
 * root page is the initial page loaded in the app, or a page that has been set as the root
 * using the [setRoot](../../nav/NavController/#setRoot) method on the [NavController](../../nav/NavController).
 *
 * For example, say the application has two pages, `Page1` and `Page2`, and both have a
 * `MenuToggle` button in their navigation bars. Assume the initial page loaded into the app
 * is `Page1`, making it the root page. `Page1` will display the `MenuToggle` button, but once
 * `Page2` is pushed onto the navigation stack, the `MenuToggle` will not be displayed.
 *
 *
 * ### Persistent Menus
 *
 * Persistent menus display the [MenuToggle](../MenuToggle) button in the [NavBar](../../nav/NavBar)
 * on all pages in the navigation stack. To make a menu persistent set `persistent` to `true` on the
 * `<ion-menu>` element. Note that this will only affect the `MenuToggle` button in the `NavBar` attached
 * to the `Menu` with `persistent` set to true, any other `MenuToggle` buttons will not be affected.
 *
 *
 * @usage
 *
 * To add a menu to an application, the `<ion-menu>` element should be added as a sibling to
 * the content it belongs to. A [local variable](https://angular.io/docs/ts/latest/guide/user-input.html#local-variables)
 * should be added to the content element and passed to the menu element in the `content` property.
 * This tells the menu which content it is attached to, so it knows which element to watch for
 * gestures. In the below example, `content` is using [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding)
 * because `mycontent` is a reference to the `<ion-nav>` element, and not a string.
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *     ...
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 *
 * <ion-nav #mycontent [root]="rootPage"></ion-nav>
 * ```
 *
 * ### Menu Side
 *
 * By default, menus slide in from the left, but this can be overridden by passing `right`
 * to the `side` property:
 *
 * ```html
 * <ion-menu side="right" [content]="mycontent">...</ion-menu>
 * ```
 *
 *
 * ### Menu Type
 *
 * The menu type can be changed by passing the value to `type` on the `<ion-menu>`:
 *
 * ```html
 * <ion-menu type="overlay" [content]="mycontent">...</ion-menu>
 * ```
 *
 * It can also be set in the app's config. The below will set the menu type to
 * `push` for all modes, and then set the type to `overlay` for the `ios` mode.
 *
 * ```ts
 * import { ionicBootstrap } from 'ionic-angular';
 *
 * ionicBootstrap(MyApp, customProviders, {
 *   menuType: 'push',
 *   platforms: {
 *     ios: {
 *       menuType: 'overlay',
 *     }
 *   }
 * });
 * ```
 *
 *
 * ### Displaying the Menu
 *
 * To toggle a menu from the template, add a button with the `menuToggle`
 * directive anywhere in the page's template:
 *
 * ```html
 * <button menuToggle>Toggle Menu</button>
 * ```
 *
 * To close a menu, add the `menuClose` button. It can be added anywhere
 * in the content, or even the menu itself. Below it is added to the menu's
 * content:
 *
 * ```html
 * <ion-menu [content]="mycontent">
 *   <ion-content>
 *     <ion-list>
 *       <button menuClose ion-item detail-none>Close Menu</button>
 *     </ion-list>
 *   </ion-content>
 * </ion-menu>
 * ```
 *
 * See the [MenuToggle](../MenuToggle) and [MenuClose](../MenuClose) docs
 * for more information on these directives.
 *
 * The menu can also be controlled from the Page by using the `MenuController`.
 * Inject the `MenuController` provider into the page and then call any of its
 * methods. In the below example, the `openMenu` method will open the menu
 * when it is called.
 *
 * ```ts
 * import { Component } from '@angular/core';
 * import { MenuController } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage {
 *  constructor(public menuCtrl: MenuController) {}
 *
 *  openMenu() {
 *    this.menuCtrl.open();
 *  }
 * }
 * ```
 *
 * See the [MenuController](../MenuController) API docs for all of the methods
 * and usage information.
 *
 *
 * @demo /docs/v2/demos/menu/
 *
 * @see {@link /docs/v2/components#menus Menu Component Docs}
 * @see {@link ../MenuController MenuController API Docs}
 * @see {@link ../../nav/Nav Nav API Docs}
 * @see {@link ../../nav/NavController NavController API Docs}
 */
export var Menu = function () {
    function Menu(_menuCtrl, _elementRef, _config, _platform, _renderer, _keyboard, _zone, gestureCtrl) {
        _classCallCheck(this, Menu);

        this._menuCtrl = _menuCtrl;
        this._elementRef = _elementRef;
        this._config = _config;
        this._platform = _platform;
        this._renderer = _renderer;
        this._keyboard = _keyboard;
        this._zone = _zone;
        this.gestureCtrl = gestureCtrl;
        this._preventTime = 0;
        this._isEnabled = true;
        this._isSwipeEnabled = true;
        this._isPers = false;
        this._init = false;
        /**
         * @private
         */
        this.isOpen = false;
        /**
         * @output {event} When the menu is being dragged open.
         */
        this.ionDrag = new EventEmitter();
        /**
         * @output {event} When the menu has been opened.
         */
        this.ionOpen = new EventEmitter();
        /**
         * @output {event} When the menu has been closed.
         */
        this.ionClose = new EventEmitter();
    }
    /**
     * @input {boolean} Whether or not the menu should be enabled. Default `true`.
     */


    _createClass(Menu, [{
        key: "ngOnInit",

        /**
         * @private
         */
        value: function ngOnInit() {
            var self = this;
            self._init = true;
            var content = self.content;
            self._cntEle = content instanceof Node ? content : content && content.getNativeElement && content.getNativeElement();
            // requires content element
            if (!self._cntEle) {
                return console.error('Menu: must have a [content] element to listen for drag events on. Example:\n\n<ion-menu [content]="content"></ion-menu>\n\n<ion-nav #content></ion-nav>');
            }
            // normalize the "side"
            if (self.side !== 'left' && self.side !== 'right') {
                self.side = 'left';
            }
            self._renderer.setElementAttribute(self._elementRef.nativeElement, 'side', self.side);
            // normalize the "type"
            if (!self.type) {
                self.type = self._config.get('menuType');
            }
            self._renderer.setElementAttribute(self._elementRef.nativeElement, 'type', self.type);
            // add the gestures
            self._cntGesture = new MenuContentGesture(self, document.body);
            // register listeners if this menu is enabled
            // check if more than one menu is on the same side
            var hasEnabledSameSideMenu = self._menuCtrl.getMenus().some(function (m) {
                return m.side === self.side && m.enabled;
            });
            if (hasEnabledSameSideMenu) {
                // auto-disable if another menu on the same side is already enabled
                self._isEnabled = false;
            }
            self._setListeners();
            // create a reusable click handler on this instance, but don't assign yet
            self.onContentClick = function (ev) {
                if (self._isEnabled) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    self.close();
                }
            };
            self._cntEle.classList.add('menu-content');
            self._cntEle.classList.add('menu-content-' + self.type);
            // register this menu with the app's menu controller
            self._menuCtrl.register(self);
        }
        /**
         * @private
         */

    }, {
        key: "bdClick",
        value: function bdClick(ev) {
            console.debug('backdrop clicked');
            ev.preventDefault();
            ev.stopPropagation();
            this._menuCtrl.close();
        }
        /**
         * @private
         */

    }, {
        key: "_setListeners",
        value: function _setListeners() {
            var self = this;
            if (self._init) {
                // only listen/unlisten if the menu has initialized
                if (self._isEnabled && self._isSwipeEnabled && !self._cntGesture.isListening) {
                    // should listen, but is not currently listening
                    console.debug('menu, gesture listen', self.side);
                    self._cntGesture.listen();
                } else if (self._cntGesture.isListening && (!self._isEnabled || !self._isSwipeEnabled)) {
                    // should not listen, but is currently listening
                    console.debug('menu, gesture unlisten', self.side);
                    self._cntGesture.unlisten();
                }
            }
        }
        /**
         * @private
         */

    }, {
        key: "_getType",
        value: function _getType() {
            if (!this._type) {
                this._type = MenuController.create(this.type, this, this._platform);
                if (this._config.get('animate') === false) {
                    this._type.ani.duration(0);
                }
            }
            return this._type;
        }
        /**
         * @private
         */

    }, {
        key: "setOpen",
        value: function setOpen(shouldOpen) {
            var _this = this;

            var animated = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

            // _isPrevented is used to prevent unwanted opening/closing after swiping open/close
            // or swiping open the menu while pressing down on the MenuToggle button
            if (shouldOpen && this.isOpen || this._isPrevented()) {
                return Promise.resolve(this.isOpen);
            }
            this._before();
            return new Promise(function (resolve) {
                _this._getType().setOpen(shouldOpen, animated, function () {
                    _this._after(shouldOpen);
                    resolve(_this.isOpen);
                });
            });
        }
        /**
         * @private
         */

    }, {
        key: "swipeStart",
        value: function swipeStart() {
            // user started swiping the menu open/close
            if (this._isEnabled && this._isSwipeEnabled && !this._isPrevented()) {
                this._before();
                this._getType().setProgressStart(this.isOpen);
            }
        }
        /**
         * @private
         */

    }, {
        key: "swipeProgress",
        value: function swipeProgress(stepValue) {
            // user actively dragging the menu
            if (this._isEnabled && this._isSwipeEnabled) {
                this._prevent();
                this._getType().setProgessStep(stepValue);
                this.ionDrag.emit(stepValue);
            }
        }
        /**
         * @private
         */

    }, {
        key: "swipeEnd",
        value: function swipeEnd(shouldCompleteLeft, shouldCompleteRight, stepValue) {
            var _this2 = this;

            // user has finished dragging the menu
            if (this._isEnabled && this._isSwipeEnabled) {
                this._prevent();
                var opening = !this.isOpen;
                var shouldComplete = false;
                if (opening) {
                    shouldComplete = this.side === 'right' ? shouldCompleteLeft : shouldCompleteRight;
                } else {
                    shouldComplete = this.side === 'right' ? shouldCompleteRight : shouldCompleteLeft;
                }
                this._getType().setProgressEnd(shouldComplete, stepValue, function (isOpen) {
                    console.debug('menu, swipeEnd', _this2.side);
                    _this2._after(isOpen);
                });
            }
        }
    }, {
        key: "_before",
        value: function _before() {
            // this places the menu into the correct location before it animates in
            // this css class doesn't actually kick off any animations
            if (this._isEnabled) {
                this.getNativeElement().classList.add('show-menu');
                this.getBackdropElement().classList.add('show-backdrop');
                this._prevent();
                this._keyboard.close();
            }
        }
    }, {
        key: "_after",
        value: function _after(isOpen) {
            // keep opening/closing the menu disabled for a touch more yet
            // only add listeners/css if it's enabled and isOpen
            // and only remove listeners/css if it's not open
            // emit opened/closed events
            if (this._isEnabled && isOpen || !isOpen) {
                this._prevent();
                this.isOpen = isOpen;
                this._cntEle.classList[isOpen ? 'add' : 'remove']('menu-content-open');
                this._cntEle.removeEventListener('click', this.onContentClick);
                if (isOpen) {
                    this._cntEle.addEventListener('click', this.onContentClick);
                    this.ionOpen.emit(true);
                } else {
                    this.getNativeElement().classList.remove('show-menu');
                    this.getBackdropElement().classList.remove('show-backdrop');
                    this.ionClose.emit(true);
                }
            }
        }
    }, {
        key: "_prevent",
        value: function _prevent() {
            // used to prevent unwanted opening/closing after swiping open/close
            // or swiping open the menu while pressing down on the MenuToggle
            this._preventTime = Date.now() + 20;
        }
    }, {
        key: "_isPrevented",
        value: function _isPrevented() {
            return this._preventTime > Date.now();
        }
        /**
         * @private
         */

    }, {
        key: "open",
        value: function open() {
            return this.setOpen(true);
        }
        /**
         * @private
         */

    }, {
        key: "close",
        value: function close() {
            return this.setOpen(false);
        }
        /**
         * @private
         */

    }, {
        key: "toggle",
        value: function toggle() {
            return this.setOpen(!this.isOpen);
        }
        /**
         * @private
         */

    }, {
        key: "enable",
        value: function enable(shouldEnable) {
            var _this3 = this;

            this.enabled = shouldEnable;
            if (!shouldEnable && this.isOpen) {
                // close if this menu is open, and should not be enabled
                this.close();
            }
            if (shouldEnable) {
                // if this menu should be enabled
                // then find all the other menus on this same side
                // and automatically disable other same side menus
                var sameSideMenus = this._menuCtrl.getMenus().filter(function (m) {
                    return m.side === _this3.side && m !== _this3;
                }).map(function (m) {
                    return m.enabled = false;
                });
            }
            return this;
        }
        /**
         * @private
         */

    }, {
        key: "swipeEnable",
        value: function swipeEnable(shouldEnable) {
            this.swipeEnabled = shouldEnable;
            return this;
        }
    }, {
        key: "getNativeElement",
        value: function getNativeElement() {
            return this._elementRef.nativeElement;
        }
        /**
         * @private
         */

    }, {
        key: "getMenuElement",
        value: function getMenuElement() {
            return this.getNativeElement().querySelector('.menu-inner');
        }
        /**
         * @private
         */

    }, {
        key: "getContentElement",
        value: function getContentElement() {
            return this._cntEle;
        }
        /**
         * @private
         */

    }, {
        key: "getBackdropElement",
        value: function getBackdropElement() {
            return this.backdrop.getNativeElement();
        }
    }, {
        key: "width",
        value: function width() {
            return this.getMenuElement().offsetWidth;
        }
        /**
         * @private
         */

    }, {
        key: "getMenuController",
        value: function getMenuController() {
            return this._menuCtrl;
        }
        /**
         * @private
         */

    }, {
        key: "ngOnDestroy",
        value: function ngOnDestroy() {
            this._menuCtrl.unregister(this);
            this._cntGesture && this._cntGesture.destroy();
            this._type && this._type.destroy();
            this._resizeUnreg && this._resizeUnreg();
            this._cntEle = null;
        }
    }, {
        key: "enabled",
        get: function get() {
            return this._isEnabled;
        },
        set: function set(val) {
            this._isEnabled = isTrueProperty(val);
            this._setListeners();
        }
        /**
         * @input {boolean} Whether or not swiping the menu should be enabled. Default `true`.
         */

    }, {
        key: "swipeEnabled",
        get: function get() {
            return this._isSwipeEnabled;
        },
        set: function set(val) {
            this._isSwipeEnabled = isTrueProperty(val);
            this._setListeners();
        }
        /**
         * @input {string} Whether or not the menu should persist on child pages. Default `false`.
         */

    }, {
        key: "persistent",
        get: function get() {
            return this._isPers;
        },
        set: function set(val) {
            this._isPers = isTrueProperty(val);
        }
    }]);

    return Menu;
}();
__decorate([ViewChild(Backdrop), __metadata('design:type', typeof (_a = typeof Backdrop !== 'undefined' && Backdrop) === 'function' && _a || Object)], Menu.prototype, "backdrop", void 0);
__decorate([Input(), __metadata('design:type', Object)], Menu.prototype, "content", void 0);
__decorate([Input(), __metadata('design:type', String)], Menu.prototype, "id", void 0);
__decorate([Input(), __metadata('design:type', String)], Menu.prototype, "side", void 0);
__decorate([Input(), __metadata('design:type', String)], Menu.prototype, "type", void 0);
__decorate([Input(), __metadata('design:type', Boolean)], Menu.prototype, "enabled", null);
__decorate([Input(), __metadata('design:type', Boolean)], Menu.prototype, "swipeEnabled", null);
__decorate([Input(), __metadata('design:type', Boolean)], Menu.prototype, "persistent", null);
__decorate([Input(), __metadata('design:type', Number)], Menu.prototype, "maxEdgeStart", void 0);
__decorate([Output(), __metadata('design:type', typeof (_b = typeof EventEmitter !== 'undefined' && EventEmitter) === 'function' && _b || Object)], Menu.prototype, "ionDrag", void 0);
__decorate([Output(), __metadata('design:type', typeof (_c = typeof EventEmitter !== 'undefined' && EventEmitter) === 'function' && _c || Object)], Menu.prototype, "ionOpen", void 0);
__decorate([Output(), __metadata('design:type', typeof (_d = typeof EventEmitter !== 'undefined' && EventEmitter) === 'function' && _d || Object)], Menu.prototype, "ionClose", void 0);
Menu = __decorate([Component({
    selector: 'ion-menu',
    host: {
        'role': 'navigation'
    },
    template: "\n    <div class=\"menu-inner\"><ng-content></ng-content></div>\n    <ion-backdrop (click)=\"bdClick($event)\" disableScroll=\"false\"></ion-backdrop>\n  ",
    directives: [Backdrop],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
}), __metadata('design:paramtypes', [typeof (_e = typeof MenuController !== 'undefined' && MenuController) === 'function' && _e || Object, typeof (_f = typeof ElementRef !== 'undefined' && ElementRef) === 'function' && _f || Object, typeof (_g = typeof Config !== 'undefined' && Config) === 'function' && _g || Object, typeof (_h = typeof Platform !== 'undefined' && Platform) === 'function' && _h || Object, typeof (_j = typeof Renderer !== 'undefined' && Renderer) === 'function' && _j || Object, typeof (_k = typeof Keyboard !== 'undefined' && Keyboard) === 'function' && _k || Object, typeof (_l = typeof NgZone !== 'undefined' && NgZone) === 'function' && _l || Object, typeof (_m = typeof GestureController !== 'undefined' && GestureController) === 'function' && _m || Object])], Menu);
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;