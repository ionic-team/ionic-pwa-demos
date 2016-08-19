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
import { Component, ComponentResolver, EventEmitter, HostBinding, Injectable, Renderer, ViewChild, ViewContainerRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ClickBlock } from '../../util/click-block';
import { Config } from '../../config/config';
import { isTabs, isNav } from '../nav/nav-controller-base';
import { NavPortal } from '../nav/nav-portal';
import { Platform } from '../../platform/platform';
/**
 * @private
 */
export var UserComponent = function UserComponent() {
    _classCallCheck(this, UserComponent);
};
/**
 * Ionic App utility service.
 */
export var App = function () {
    function App(_config, _platform) {
        _classCallCheck(this, App);

        this._config = _config;
        this._platform = _platform;
        this._disTime = 0;
        this._scrollTime = 0;
        this._title = '';
        this._titleSrv = new Title();
        this._rootNav = null;
        this.viewDidLoad = new EventEmitter();
        this.viewWillEnter = new EventEmitter();
        this.viewDidEnter = new EventEmitter();
        this.viewWillLeave = new EventEmitter();
        this.viewDidLeave = new EventEmitter();
        this.viewWillUnload = new EventEmitter();
        this.viewDidUnload = new EventEmitter();
        // listen for hardware back button events
        // register this back button action with a default priority
        _platform.registerBackButtonAction(this.navPop.bind(this));
    }
    /**
     * Sets the document title.
     * @param {string} val  Value to set the document title to.
     */


    _createClass(App, [{
        key: "setTitle",
        value: function setTitle(val) {
            if (val !== this._title) {
                this._title = val;
                this._titleSrv.setTitle(val);
            }
        }
        /**
         * @private
         * Sets if the app is currently enabled or not, meaning if it's
         * available to accept new user commands. For example, this is set to `false`
         * while views transition, a modal slides up, an action-sheet
         * slides up, etc. After the transition completes it is set back to `true`.
         * @param {boolean} isEnabled
         * @param {number} duration  When `isEnabled` is set to `false`, this argument
         * is used to set the maximum number of milliseconds that app will wait until
         * it will automatically enable the app again. It's basically a fallback incase
         * something goes wrong during a transition and the app wasn't re-enabled correctly.
         */

    }, {
        key: "setEnabled",
        value: function setEnabled(isEnabled) {
            var duration = arguments.length <= 1 || arguments[1] === undefined ? 700 : arguments[1];

            this._disTime = isEnabled ? 0 : Date.now() + duration;
            if (this.clickBlock) {
                if (isEnabled || duration <= 32) {
                    // disable the click block if it's enabled, or the duration is tiny
                    this.clickBlock.activate(false, 0);
                } else {
                    // show the click block for duration + some number
                    this.clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS);
                }
            }
        }
        /**
         * @private
         */

    }, {
        key: "setScrollDisabled",
        value: function setScrollDisabled(disableScroll) {
            var enabled = this._config.get('canDisableScroll', true);
            if (!enabled) {
                return;
            }
            if (!this.appRoot) {
                console.error('appRoot is missing, scrolling can not be enabled/disabled');
                return;
            }
            this.appRoot.disableScroll = disableScroll;
        }
        /**
         * @private
         * Boolean if the app is actively enabled or not.
         * @return {boolean}
         */

    }, {
        key: "isEnabled",
        value: function isEnabled() {
            return this._disTime < Date.now();
        }
        /**
         * @private
         */

    }, {
        key: "setScrolling",
        value: function setScrolling() {
            this._scrollTime = Date.now();
        }
        /**
         * Boolean if the app is actively scrolling or not.
         * @return {boolean}
         */

    }, {
        key: "isScrolling",
        value: function isScrolling() {
            return this._scrollTime + 48 > Date.now();
        }
        /**
         * @private
         */

    }, {
        key: "getActiveNav",
        value: function getActiveNav() {
            var nav = this._rootNav || null;
            var activeChildNav;
            while (nav) {
                activeChildNav = nav.getActiveChildNav();
                if (!activeChildNav) {
                    break;
                }
                nav = activeChildNav;
            }
            return nav;
        }
        /**
         * @private
         */

    }, {
        key: "getRootNav",
        value: function getRootNav() {
            return this._rootNav;
        }
        /**
         * @private
         */

    }, {
        key: "setRootNav",
        value: function setRootNav(nav) {
            this._rootNav = nav;
        }
        /**
         * @private
         */

    }, {
        key: "setPortal",
        value: function setPortal(portal) {
            this._portal = portal;
        }
        /**
         * @private
         */

    }, {
        key: "present",
        value: function present(enteringView) {
            var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

            enteringView.setNav(this._portal);
            opts.keyboardClose = false;
            opts.direction = 'forward';
            if (!opts.animation) {
                opts.animation = enteringView.getTransitionName('forward');
            }
            enteringView.setLeavingOpts({
                keyboardClose: false,
                direction: 'back',
                animation: enteringView.getTransitionName('back'),
                ev: opts.ev
            });
            return this._portal.insertViews(-1, [enteringView], opts);
        }
        /**
         * @private
         */

    }, {
        key: "navPop",
        value: function navPop() {
            // function used to climb up all parent nav controllers
            function navPop(nav) {
                if (nav) {
                    if (isTabs(nav)) {
                        // FYI, using "nav instanceof Tabs" throws a Promise runtime error for whatever reason, idk
                        // this is a Tabs container
                        // see if there is a valid previous tab to go to
                        var prevTab = nav.previousTab(true);
                        if (prevTab) {
                            console.debug('app, goBack previous tab');
                            nav.select(prevTab);
                            return Promise.resolve();
                        }
                    } else if (isNav(nav) && nav.length() > 1) {
                        // this nav controller has more than one view
                        // pop the current view on this nav and we're done here
                        console.debug('app, goBack pop nav');
                        return nav.pop();
                    }
                    // try again using the parent nav (if there is one)
                    return navPop(nav.parent);
                }
                // nerp, never found nav that could pop off a view
                return null;
            }
            // app must be enabled and there must be a
            // root nav controller for go back to work
            if (this._rootNav && this.isEnabled()) {
                // first check if the root navigation has any overlays
                // opened in it's portal, like alert/actionsheet/popup
                if (this._portal && this._portal.length() > 0) {
                    // there is an overlay view in the portal
                    // let's pop this one off to go back
                    console.debug('app, goBack pop overlay');
                    return this._portal.pop();
                }
                // next get the active nav, check itself and climb up all
                // of its parent navs until it finds a nav that can pop
                var navPromise = navPop(this.getActiveNav());
                if (navPromise === null) {
                    // no views to go back to
                    // let's exit the app
                    if (this._config.getBoolean('navExitApp', true)) {
                        console.debug('app, goBack exitApp');
                        this._platform.exitApp();
                    }
                }
                return navPromise;
            }
            return Promise.resolve();
        }
        /**
         * @private
         */

    }, {
        key: "getRegisteredComponent",
        value: function getRegisteredComponent(cls) {
            // deprecated warning: added 2016-04-28, beta7
            console.warn('Using app.getRegisteredComponent() to query components has been deprecated. ' + 'Please use Angular\'s ViewChild annotation instead:\n\nhttp://learnangular2.com/viewChild/');
        }
        /**
         * @private
         */

    }, {
        key: "getComponent",
        value: function getComponent(id) {
            // deprecated warning: added 2016-04-28, beta7
            console.warn('Using app.getComponent() to query components has been deprecated. ' + 'Please use Angular\'s ViewChild annotation instead:\n\nhttp://learnangular2.com/viewChild/');
        }
        /**
         * Get an instance of the global app injector that contains references to all of the instantiated providers
         * @returns {Injector}
         */

    }, {
        key: "getAppInjector",
        value: function getAppInjector() {
            // deprecated warning: added 2016-06-27, beta10
            console.warn('Recent Angular2 versions should no longer require App.getAppInjector()');
        }
    }]);

    return App;
}();
App = __decorate([Injectable(), __metadata('design:paramtypes', [typeof (_a = typeof Config !== 'undefined' && Config) === 'function' && _a || Object, typeof (_b = typeof Platform !== 'undefined' && Platform) === 'function' && _b || Object])], App);
/**
 * @private
 */
export var AppRoot = function () {
    function AppRoot(_cmp, _cr, _renderer, app) {
        _classCallCheck(this, AppRoot);

        this._cmp = _cmp;
        this._cr = _cr;
        this._renderer = _renderer;
        this.disableScroll = false;
        app.appRoot = this;
    }

    _createClass(AppRoot, [{
        key: "ngAfterViewInit",
        value: function ngAfterViewInit() {
            var _this = this;

            // load the user app's root component
            this._cr.resolveComponent(this._cmp).then(function (componentFactory) {
                var appEle = _this._renderer.createElement(null, componentFactory.selector || 'div', null);
                appEle.setAttribute('class', 'app-root');
                var componentRef = componentFactory.create(_this._viewport.injector, null, appEle);
                _this._viewport.insert(componentRef.hostView, 0);
            });
        }
    }]);

    return AppRoot;
}();
__decorate([ViewChild('anchor', { read: ViewContainerRef }), __metadata('design:type', typeof (_c = typeof ViewContainerRef !== 'undefined' && ViewContainerRef) === 'function' && _c || Object)], AppRoot.prototype, "_viewport", void 0);
__decorate([HostBinding('class.disable-scroll'), __metadata('design:type', Boolean)], AppRoot.prototype, "disableScroll", void 0);
AppRoot = __decorate([Component({
    selector: 'ion-app',
    template: "\n    <div #anchor nav-portal></div>\n    <click-block></click-block>\n  ",
    directives: [NavPortal, ClickBlock]
}), __metadata('design:paramtypes', [UserComponent, typeof (_d = typeof ComponentResolver !== 'undefined' && ComponentResolver) === 'function' && _d || Object, typeof (_e = typeof Renderer !== 'undefined' && Renderer) === 'function' && _e || Object, App])], AppRoot);
var CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
var _a, _b, _c, _d, _e;