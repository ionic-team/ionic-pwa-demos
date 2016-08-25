"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var common_1 = require('@angular/common');
var app_1 = require('../app/app');
var badge_1 = require('../badge/badge');
var config_1 = require('../../config/config');
var content_1 = require('../content/content');
var icon_1 = require('../icon/icon');
var ion_1 = require('../ion');
var util_1 = require('../../util/util');
var dom_1 = require('../../util/dom');
var nav_controller_1 = require('../nav/nav-controller');
var platform_1 = require('../../platform/platform');
var tab_button_1 = require('./tab-button');
var tab_highlight_1 = require('./tab-highlight');
var view_controller_1 = require('../nav/view-controller');
/**
 * @name Tabs
 * @description
 * Tabs make it easy to navigate between different pages or functional
 * aspects of an app. The Tabs component, written as `<ion-tabs>`, is
 * a container of individual [Tab](../Tab/) components. Each individual `ion-tab`
 * is a declarative component for a [NavController](../NavController/)

 * For more information on using nav controllers like Tab or [Nav](../../nav/Nav/),
 * take a look at the [NavController API Docs](../NavController/).
 *
 * ### Placement
 *
 * The position of the tabs relative to the content varies based on
 * the mode. The tabs are placed at the bottom of the screen
 * for iOS and Android, and at the top for Windows by default. The position can be configured using the `tabsPlacement` attribute
 * on the `<ion-tabs>` component, or in an app's [config](../../config/Config/).
 * See the [Input Properties](#input-properties) below for the available
 * values of `tabsPlacement`.

 * ### Layout
 *
 * The layout for all of the tabs can be defined using the `tabsLayout`
 * property. If the individual tab has a title and icon, the icons will
 * show on top of the title by default. All tabs can be changed by setting
 * the value of `tabsLayout` on the `<ion-tabs>` element, or in your
 * app's [config](../../config/Config/). For example, this is useful if
 * you want to show tabs with a title only on Android, but show icons
 * and a title for iOS. See the [Input Properties](#input-properties)
 * below for the available values of `tabsLayout`.
 *
 * ### Selecting a Tab
 *
 * There are different ways you can select a specific tab from the tabs
 * component. You can use the `selectedIndex` property to set the index
 * on the `<ion-tabs>` element, or you can call `select()` from the `Tabs`
 * instance after creation. See [usage](#usage) below for more information.
 *
 * @usage
 *
 * You can add a basic tabs template to a `@Component` using the following
 * template:
 *
 * ```html
 * <ion-tabs>
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Where `tab1Root`, `tab2Root`, and `tab3Root` are each a page:
 *
 *```ts
 * @Component({
 *   templateUrl: 'build/pages/tabs/tabs.html'
 * })
 * export class TabsPage {
 *   // this tells the tabs component which Pages
 *   // should be each tab's root Page
 *   tab1Root = Page1;
 *   tab2Root = Page2;
 *   tab3Root = Page3;
 *
 *   constructor() {
 *
 *   }
 * }
 *```
 *
 * By default, the first tab will be selected upon navigation to the
 * Tabs page. We can change the selected tab by using `selectedIndex`
 * on the `<ion-tabs>` element:
 *
 * ```html
 * <ion-tabs selectedIndex="2">
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Since the index starts at `0`, this will select the 3rd tab which has
 * root set to `tab3Root`. If you wanted to change it dynamically from
 * your class, you could use [property binding](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#property-binding).
 *
 * Alternatively, you can grab the `Tabs` instance and call the `select()`
 * method. This requires the `<ion-tabs>` element to have an `id`. For
 * example, set the value of `id` to `myTabs`:
 *
 * ```html
 * <ion-tabs #myTabs>
 *   <ion-tab [root]="tab1Root"></ion-tab>
 *   <ion-tab [root]="tab2Root"></ion-tab>
 *   <ion-tab [root]="tab3Root"></ion-tab>
 * </ion-tabs>
 * ```
 *
 * Then in your class you can grab the `Tabs` instance and call `select()`,
 * passing the index of the tab as the argument. Here we're grabbing the tabs
 * by using ViewChild.
 *
 *```ts
 * export class TabsPage {
 *
 * @ViewChild('myTabs') tabRef: Tabs;
 *
 * ionViewDidEnter() {
 *   this.tabRef.select(2);
 *  }
 *
 * }
 *```
 *
 * @demo /docs/v2/demos/tabs/
 *
 * @see {@link /docs/v2/components#tabs Tabs Component Docs}
 * @see {@link ../Tab Tab API Docs}
 * @see {@link ../../config/Config Config API Docs}
 *
 */
var Tabs = (function (_super) {
    __extends(Tabs, _super);
    function Tabs(parent, viewCtrl, _app, _config, _elementRef, _platform, _renderer) {
        var _this = this;
        _super.call(this, _elementRef);
        this.viewCtrl = viewCtrl;
        this._app = _app;
        this._config = _config;
        this._elementRef = _elementRef;
        this._platform = _platform;
        this._renderer = _renderer;
        this._ids = -1;
        this._tabs = [];
        this._onReady = null;
        /**
         * @private
         */
        this.selectHistory = [];
        /**
         * @input {any} Expression to evaluate when the tab changes.
         */
        this.ionChange = new core_1.EventEmitter();
        this.parent = parent;
        this.id = 't' + (++tabIds);
        this._sbPadding = _config.getBoolean('statusbarPadding');
        this.subPages = _config.getBoolean('tabsHideOnSubPages');
        this.tabsHighlight = _config.getBoolean('tabsHighlight');
        // TODO deprecated 07-07-2016 beta.11
        if (_config.get('tabSubPages') !== null) {
            void 0;
            this.subPages = _config.getBoolean('tabSubPages');
        }
        // TODO deprecated 07-07-2016 beta.11
        if (_config.get('tabbarHighlight') !== null) {
            void 0;
            this.tabsHighlight = _config.getBoolean('tabbarHighlight');
        }
        if (this.parent) {
            // this Tabs has a parent Nav
            this.parent.registerChildNav(this);
        }
        else if (viewCtrl && viewCtrl.getNav()) {
            // this Nav was opened from a modal
            this.parent = viewCtrl.getNav();
            this.parent.registerChildNav(this);
        }
        else if (this._app) {
            // this is the root navcontroller for the entire app
            this._app.setRootNav(this);
        }
        // Tabs may also be an actual ViewController which was navigated to
        // if Tabs is static and not navigated to within a NavController
        // then skip this and don't treat it as it's own ViewController
        if (viewCtrl) {
            viewCtrl.setContent(this);
            viewCtrl.setContentRef(_elementRef);
            viewCtrl.loaded = function (done) {
                _this._onReady = done;
            };
        }
    }
    /**
     * @private
     */
    Tabs.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._setConfig('tabsPlacement', 'bottom');
        this._setConfig('tabsLayout', 'icon-top');
        this._setConfig('tabsHighlight', this.tabsHighlight);
        // TODO deprecated 07-07-2016 beta.11
        this._setConfig('tabbarPlacement', 'bottom');
        this._setConfig('tabbarLayout', 'icon-top');
        // TODO deprecated 07-07-2016 beta.11
        if (this.tabbarPlacement !== undefined) {
            void 0;
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsPlacement', this.tabbarPlacement);
            this.tabsPlacement = this.tabbarPlacement;
        }
        // TODO deprecated 07-07-2016 beta.11
        if (this._config.get('tabbarPlacement') !== null) {
            void 0;
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsPlacement', this._config.get('tabbarPlacement'));
        }
        // TODO deprecated 07-07-2016 beta.11
        if (this.tabbarLayout !== undefined) {
            void 0;
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsLayout', this.tabbarLayout);
            this.tabsLayout = this.tabbarLayout;
        }
        // TODO deprecated 07-07-2016 beta.11
        if (this._config.get('tabbarLayout') !== null) {
            void 0;
            this._renderer.setElementAttribute(this._elementRef.nativeElement, 'tabsLayout', this._config.get('tabsLayout'));
        }
        if (this.tabsHighlight) {
            this._platform.onResize(function () {
                _this._highlight.select(_this.getSelected());
            });
        }
        this.initTabs();
    };
    /**
     * @private
     */
    Tabs.prototype.initTabs = function () {
        var _this = this;
        // get the selected index from the input
        // otherwise default it to use the first index
        var selectedIndex = (util_1.isBlank(this.selectedIndex) ? 0 : parseInt(this.selectedIndex, 10));
        // get the selectedIndex and ensure it isn't hidden or disabled
        var selectedTab = this._tabs.find(function (t, i) { return i === selectedIndex && t.enabled && t.show; });
        if (!selectedTab) {
            // wasn't able to select the tab they wanted
            // try to find the first tab that's available
            selectedTab = this._tabs.find(function (t) { return t.enabled && t.show; });
        }
        if (selectedTab) {
            // we found a tab to select
            this.select(selectedTab);
        }
        // check if preloadTab is set as an input @Input
        // otherwise check the preloadTabs config
        var shouldPreloadTabs = (util_1.isBlank(this.preloadTabs) ? this._config.getBoolean('preloadTabs') : util_1.isTrueProperty(this.preloadTabs));
        if (shouldPreloadTabs) {
            // preload all the tabs which isn't the selected tab
            this._tabs.filter(function (t) { return t !== selectedTab; }).forEach(function (tab, index) {
                tab.preload(_this._config.getNumber('tabsPreloadDelay', 1000) * index);
            });
        }
    };
    /**
     * @private
     */
    Tabs.prototype._setConfig = function (attrKey, fallback) {
        var val = this[attrKey];
        if (util_1.isBlank(val)) {
            val = this._config.get(attrKey, fallback);
        }
        this._renderer.setElementAttribute(this._elementRef.nativeElement, attrKey, val);
    };
    /**
     * @private
     */
    Tabs.prototype.add = function (tab) {
        tab.id = this.id + '-' + (++this._ids);
        this._tabs.push(tab);
    };
    /**
     * @param {number|Tab} tabOrIndex Index, or the Tab instance, of the tab to select.
     */
    Tabs.prototype.select = function (tabOrIndex, opts, done) {
        var _this = this;
        if (opts === void 0) { opts = {}; }
        var promise;
        if (!done) {
            promise = new Promise(function (res) { done = res; });
        }
        var selectedTab = (typeof tabOrIndex === 'number' ? this.getByIndex(tabOrIndex) : tabOrIndex);
        if (util_1.isBlank(selectedTab)) {
            return Promise.resolve();
        }
        var deselectedTab = this.getSelected();
        if (selectedTab === deselectedTab) {
            // no change
            this._touchActive(selectedTab);
            return Promise.resolve();
        }
        void 0;
        var deselectedPage;
        if (deselectedTab) {
            deselectedPage = deselectedTab.getActive();
            deselectedPage && deselectedPage.fireWillLeave();
        }
        opts.animate = false;
        var selectedPage = selectedTab.getActive();
        selectedPage && selectedPage.fireWillEnter();
        selectedTab.load(opts, function (initialLoad) {
            selectedTab.ionSelect.emit(selectedTab);
            _this.ionChange.emit(selectedTab);
            if (selectedTab.root) {
                // only show the selectedTab if it has a root
                // it's possible the tab is only for opening modal's or signing out
                // and doesn't actually have content. In the case there's no content
                // for a tab then do nothing and leave the current view as is
                _this._tabs.forEach(function (tab) {
                    tab.setSelected(tab === selectedTab);
                });
                if (_this.tabsHighlight) {
                    _this._highlight.select(selectedTab);
                }
            }
            selectedPage && selectedPage.fireDidEnter();
            deselectedPage && deselectedPage.fireDidLeave();
            if (_this._onReady) {
                _this._onReady();
                _this._onReady = null;
            }
            // track the order of which tabs have been selected, by their index
            // do not track if the tab index is the same as the previous
            if (_this.selectHistory[_this.selectHistory.length - 1] !== selectedTab.id) {
                _this.selectHistory.push(selectedTab.id);
            }
            // if this is not the Tab's initial load then we need
            // to refresh the tabbar and content dimensions to be sure
            // they're lined up correctly
            if (!initialLoad && selectedPage) {
                var content = selectedPage.getContent();
                if (content && content instanceof content_1.Content) {
                    dom_1.nativeRaf(function () {
                        content.readDimensions();
                        content.writeDimensions();
                    });
                }
            }
            done();
        });
        return promise;
    };
    /**
     * Get the previously selected Tab which is currently not disabled or hidden.
     * @param {boolean} trimHistory If the selection history should be trimmed up to the previous tab selection or not.
     * @returns {Tab}
     */
    Tabs.prototype.previousTab = function (trimHistory) {
        var _this = this;
        if (trimHistory === void 0) { trimHistory = true; }
        // walk backwards through the tab selection history
        // and find the first previous tab that is enabled and shown
        void 0;
        for (var i = this.selectHistory.length - 2; i >= 0; i--) {
            var tab = this._tabs.find(function (t) { return t.id === _this.selectHistory[i]; });
            if (tab && tab.enabled && tab.show) {
                if (trimHistory) {
                    this.selectHistory.splice(i + 1);
                }
                return tab;
            }
        }
        return null;
    };
    /**
     * @param {number} index Index of the tab you want to get
     * @returns {Tab} Returns the tab who's index matches the one passed
     */
    Tabs.prototype.getByIndex = function (index) {
        if (index < this._tabs.length && index > -1) {
            return this._tabs[index];
        }
        return null;
    };
    /**
     * @return {Tab} Returns the currently selected tab
     */
    Tabs.prototype.getSelected = function () {
        for (var i = 0; i < this._tabs.length; i++) {
            if (this._tabs[i].isSelected) {
                return this._tabs[i];
            }
        }
        return null;
    };
    /**
     * @private
     */
    Tabs.prototype.getActiveChildNav = function () {
        return this.getSelected();
    };
    /**
     * @private
     */
    Tabs.prototype.getIndex = function (tab) {
        return this._tabs.indexOf(tab);
    };
    /**
     * @private
     */
    Tabs.prototype.length = function () {
        return this._tabs.length;
    };
    /**
     * @private
     * "Touch" the active tab, going back to the root view of the tab
     * or optionally letting the tab handle the event
     */
    Tabs.prototype._touchActive = function (tab) {
        var active = tab.getActive();
        if (!active) {
            return Promise.resolve();
        }
        var instance = active.instance;
        // If they have a custom tab selected handler, call it
        if (instance.ionSelected) {
            return instance.ionSelected();
        }
        // If we're a few pages deep, pop to root
        if (tab.length() > 1) {
            // Pop to the root view
            return tab.popToRoot();
        }
        // Otherwise, if the page we're on is not our real root, reset it to our
        // default root type
        if (tab.root !== active.componentType) {
            return tab.setRoot(tab.root);
        }
        // And failing all of that, we do something safe and secure
        return Promise.resolve();
    };
    /**
     * @private
     * DOM WRITE
     */
    Tabs.prototype.setTabbarPosition = function (top, bottom) {
        if (this._top !== top || this._bottom !== bottom) {
            var tabbarEle = this._tabbar.nativeElement;
            tabbarEle.style.top = (top > -1 ? top + 'px' : '');
            tabbarEle.style.bottom = (bottom > -1 ? bottom + 'px' : '');
            tabbarEle.classList.add('show-tabbar');
            this._top = top;
            this._bottom = bottom;
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Tabs.prototype, "selectedIndex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], Tabs.prototype, "preloadTabs", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Tabs.prototype, "tabbarLayout", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Tabs.prototype, "tabsLayout", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Tabs.prototype, "tabbarPlacement", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], Tabs.prototype, "tabsPlacement", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], Tabs.prototype, "tabsHighlight", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', core_1.EventEmitter)
    ], Tabs.prototype, "ionChange", void 0);
    __decorate([
        core_1.ViewChild(tab_highlight_1.TabHighlight), 
        __metadata('design:type', tab_highlight_1.TabHighlight)
    ], Tabs.prototype, "_highlight", void 0);
    __decorate([
        core_1.ViewChild('tabbar'), 
        __metadata('design:type', core_1.ElementRef)
    ], Tabs.prototype, "_tabbar", void 0);
    __decorate([
        core_1.ViewChild('portal', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], Tabs.prototype, "portal", void 0);
    Tabs = __decorate([
        core_1.Component({
            selector: 'ion-tabs',
            template: "\n    <ion-tabbar role=\"tablist\" #tabbar>\n      <a *ngFor=\"let t of _tabs\" [tab]=\"t\" class=\"tab-button\" [class.tab-disabled]=\"!t.enabled\" [class.tab-hidden]=\"!t.show\" role=\"tab\" href=\"#\" (ionSelect)=\"select($event)\">\n        <ion-icon *ngIf=\"t.tabIcon\" [name]=\"t.tabIcon\" [isActive]=\"t.isSelected\" class=\"tab-button-icon\"></ion-icon>\n        <span *ngIf=\"t.tabTitle\" class=\"tab-button-text\">{{t.tabTitle}}</span>\n        <ion-badge *ngIf=\"t.tabBadge\" class=\"tab-badge\" [ngClass]=\"'badge-' + t.tabBadgeStyle\">{{t.tabBadge}}</ion-badge>\n        <ion-button-effect></ion-button-effect>\n      </a>\n      <tab-highlight></tab-highlight>\n    </ion-tabbar>\n    <ng-content></ng-content>\n    <div #portal tab-portal></div>\n  ",
            directives: [badge_1.Badge, icon_1.Icon, common_1.NgClass, common_1.NgFor, common_1.NgIf, tab_button_1.TabButton, tab_highlight_1.TabHighlight],
            encapsulation: core_1.ViewEncapsulation.None,
        }),
        __param(0, core_1.Optional()),
        __param(1, core_1.Optional()), 
        __metadata('design:paramtypes', [nav_controller_1.NavController, view_controller_1.ViewController, app_1.App, config_1.Config, core_1.ElementRef, platform_1.Platform, core_1.Renderer])
    ], Tabs);
    return Tabs;
}(ion_1.Ion));
exports.Tabs = Tabs;
var tabIds = -1;
