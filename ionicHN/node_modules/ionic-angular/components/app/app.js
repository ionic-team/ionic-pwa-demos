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
var core_1 = require('@angular/core');
var platform_browser_1 = require('@angular/platform-browser');
var click_block_1 = require('../../util/click-block');
var config_1 = require('../../config/config');
var nav_controller_base_1 = require('../nav/nav-controller-base');
var nav_portal_1 = require('../nav/nav-portal');
var platform_1 = require('../../platform/platform');
/**
 * @private
 */
var UserComponent = (function () {
    function UserComponent() {
    }
    return UserComponent;
}());
exports.UserComponent = UserComponent;
/**
 * Ionic App utility service.
 */
var App = (function () {
    function App(_config, _platform) {
        this._config = _config;
        this._platform = _platform;
        this._disTime = 0;
        this._scrollTime = 0;
        this._title = '';
        this._titleSrv = new platform_browser_1.Title();
        this._rootNav = null;
        this.viewDidLoad = new core_1.EventEmitter();
        this.viewWillEnter = new core_1.EventEmitter();
        this.viewDidEnter = new core_1.EventEmitter();
        this.viewWillLeave = new core_1.EventEmitter();
        this.viewDidLeave = new core_1.EventEmitter();
        this.viewWillUnload = new core_1.EventEmitter();
        this.viewDidUnload = new core_1.EventEmitter();
        // listen for hardware back button events
        // register this back button action with a default priority
        _platform.registerBackButtonAction(this.navPop.bind(this));
    }
    /**
     * Sets the document title.
     * @param {string} val  Value to set the document title to.
     */
    App.prototype.setTitle = function (val) {
        if (val !== this._title) {
            this._title = val;
            this._titleSrv.setTitle(val);
        }
    };
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
    App.prototype.setEnabled = function (isEnabled, duration) {
        if (duration === void 0) { duration = 700; }
        this._disTime = (isEnabled ? 0 : Date.now() + duration);
        if (this.clickBlock) {
            if (isEnabled || duration <= 32) {
                // disable the click block if it's enabled, or the duration is tiny
                this.clickBlock.activate(false, 0);
            }
            else {
                // show the click block for duration + some number
                this.clickBlock.activate(true, duration + CLICK_BLOCK_BUFFER_IN_MILLIS);
            }
        }
    };
    /**
     * @private
     */
    App.prototype.setScrollDisabled = function (disableScroll) {
        var enabled = this._config.get('canDisableScroll', true);
        if (!enabled) {
            return;
        }
        if (!this.appRoot) {
            void 0;
            return;
        }
        this.appRoot.disableScroll = disableScroll;
    };
    /**
     * @private
     * Boolean if the app is actively enabled or not.
     * @return {boolean}
     */
    App.prototype.isEnabled = function () {
        return (this._disTime < Date.now());
    };
    /**
     * @private
     */
    App.prototype.setScrolling = function () {
        this._scrollTime = Date.now();
    };
    /**
     * Boolean if the app is actively scrolling or not.
     * @return {boolean}
     */
    App.prototype.isScrolling = function () {
        return (this._scrollTime + 48 > Date.now());
    };
    /**
     * @private
     */
    App.prototype.getActiveNav = function () {
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
    };
    /**
     * @private
     */
    App.prototype.getRootNav = function () {
        return this._rootNav;
    };
    /**
     * @private
     */
    App.prototype.setRootNav = function (nav) {
        this._rootNav = nav;
    };
    /**
     * @private
     */
    App.prototype.setPortal = function (portal) {
        this._portal = portal;
    };
    /**
     * @private
     */
    App.prototype.present = function (enteringView, opts) {
        if (opts === void 0) { opts = {}; }
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
    };
    /**
     * @private
     */
    App.prototype.navPop = function () {
        // function used to climb up all parent nav controllers
        function navPop(nav) {
            if (nav) {
                if (nav_controller_base_1.isTabs(nav)) {
                    // FYI, using "nav instanceof Tabs" throws a Promise runtime error for whatever reason, idk
                    // this is a Tabs container
                    // see if there is a valid previous tab to go to
                    var prevTab = nav.previousTab(true);
                    if (prevTab) {
                        void 0;
                        nav.select(prevTab);
                        return Promise.resolve();
                    }
                }
                else if (nav_controller_base_1.isNav(nav) && nav.length() > 1) {
                    // this nav controller has more than one view
                    // pop the current view on this nav and we're done here
                    void 0;
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
                void 0;
                return this._portal.pop();
            }
            // next get the active nav, check itself and climb up all
            // of its parent navs until it finds a nav that can pop
            var navPromise = navPop(this.getActiveNav());
            if (navPromise === null) {
                // no views to go back to
                // let's exit the app
                if (this._config.getBoolean('navExitApp', true)) {
                    void 0;
                    this._platform.exitApp();
                }
            }
            return navPromise;
        }
        return Promise.resolve();
    };
    /**
     * @private
     */
    App.prototype.getRegisteredComponent = function (cls) {
        // deprecated warning: added 2016-04-28, beta7
        void 0;
    };
    /**
     * @private
     */
    App.prototype.getComponent = function (id) {
        // deprecated warning: added 2016-04-28, beta7
        void 0;
    };
    /**
     * Get an instance of the global app injector that contains references to all of the instantiated providers
     * @returns {Injector}
     */
    App.prototype.getAppInjector = function () {
        // deprecated warning: added 2016-06-27, beta10
        void 0;
    };
    App = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [config_1.Config, platform_1.Platform])
    ], App);
    return App;
}());
exports.App = App;
/**
 * @private
 */
var AppRoot = (function () {
    function AppRoot(_cmp, _cr, _renderer, app) {
        this._cmp = _cmp;
        this._cr = _cr;
        this._renderer = _renderer;
        this.disableScroll = false;
        app.appRoot = this;
    }
    AppRoot.prototype.ngAfterViewInit = function () {
        var _this = this;
        // load the user app's root component
        this._cr.resolveComponent(this._cmp).then(function (componentFactory) {
            var appEle = _this._renderer.createElement(null, componentFactory.selector || 'div', null);
            appEle.setAttribute('class', 'app-root');
            var componentRef = componentFactory.create(_this._viewport.injector, null, appEle);
            _this._viewport.insert(componentRef.hostView, 0);
        });
    };
    __decorate([
        core_1.ViewChild('anchor', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], AppRoot.prototype, "_viewport", void 0);
    __decorate([
        core_1.HostBinding('class.disable-scroll'), 
        __metadata('design:type', Boolean)
    ], AppRoot.prototype, "disableScroll", void 0);
    AppRoot = __decorate([
        core_1.Component({
            selector: 'ion-app',
            template: "\n    <div #anchor nav-portal></div>\n    <click-block></click-block>\n  ",
            directives: [nav_portal_1.NavPortal, click_block_1.ClickBlock]
        }), 
        __metadata('design:paramtypes', [UserComponent, core_1.ComponentResolver, core_1.Renderer, App])
    ], AppRoot);
    return AppRoot;
}());
exports.AppRoot = AppRoot;
var CLICK_BLOCK_BUFFER_IN_MILLIS = 64;
