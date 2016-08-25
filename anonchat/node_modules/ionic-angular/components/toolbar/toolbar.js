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
var config_1 = require('../../config/config');
var ion_1 = require('../ion');
var view_controller_1 = require('../nav/view-controller');
/**
 * @name Header
 * @description
 * Header is a parent compnent that holds the navbar and toolbar component.
 * It's important to note that `ion-header` needs to be the one of the three root elements of a page
 *
 * @usage
 *
 * ```ts
 * @Component({
 *   template: `
 *      <ion-header>
 *        <ion-navbar>
 *          <ion-title>Page1</ion-title>
 *        </ion-navbar>
 *
 *        <ion-toolbar>
 *          <ion-title>Subheader</ion-title>
 *        </ion-toolbar>
 *      </ion-header>
 *
 *      <ion-content></ion-content>
 *   `
 * })
 * ```
 *
 */
var Header = (function () {
    function Header(viewCtrl) {
        viewCtrl && viewCtrl.setHeader(this);
    }
    Header = __decorate([
        core_1.Directive({
            selector: 'ion-header'
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [view_controller_1.ViewController])
    ], Header);
    return Header;
}());
exports.Header = Header;
/**
 * @name Footer
 * @description
 * Footer is a root component of a page that sits at the bottom of the page.
 * Footer can be a wrapper for `ion-toolbar` to make sure the content area is sized correctly.
 *
 * @usage
 *
 * ```ts
 * @Component({
 *   template: `
 *      <ion-content></ion-content>
 *      <ion-footer>
 *        <ion-toolbar>
 *          <ion-title>Footer</ion-title>
 *        </ion-toolbar>
 *      </ion-footer>
 *   `
 * })
 * ```
 *
 */
var Footer = (function () {
    function Footer(viewCtrl) {
        viewCtrl && viewCtrl.setFooter(this);
    }
    Footer = __decorate([
        core_1.Directive({
            selector: 'ion-footer'
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [view_controller_1.ViewController])
    ], Footer);
    return Footer;
}());
exports.Footer = Footer;
/**
 * @private
 */
var ToolbarBase = (function (_super) {
    __extends(ToolbarBase, _super);
    function ToolbarBase(elementRef) {
        _super.call(this, elementRef);
        this.itemRefs = [];
        this.titleRef = null;
    }
    /**
     * @private
     */
    ToolbarBase.prototype.setTitleCmp = function (titleCmp) {
        this.titleCmp = titleCmp;
    };
    /**
     * @private
     * Returns the toolbar title text if it exists or an empty string
     */
    ToolbarBase.prototype.getTitleText = function () {
        return (this.titleCmp && this.titleCmp.getTitleText()) || '';
    };
    /**
     * @private
     */
    ToolbarBase.prototype.getTitleRef = function () {
        return this.titleCmp && this.titleCmp.elementRef;
    };
    /**
     * @private
     * A toolbar items include the left and right side `ion-buttons`,
     * and every `menu-toggle`. It does not include the `ion-title`.
     * @returns {TODO} Array of this toolbar's item ElementRefs.
     */
    ToolbarBase.prototype.getItemRefs = function () {
        return this.itemRefs;
    };
    /**
     * @private
     */
    ToolbarBase.prototype.addItemRef = function (itemElementRef) {
        this.itemRefs.push(itemElementRef);
    };
    return ToolbarBase;
}(ion_1.Ion));
exports.ToolbarBase = ToolbarBase;
/**
 * @name Toolbar
 * @description
 * A Toolbar is a generic bar that is positioned above or below content.
 * Unlike a [Navbar](../../nav/Navbar), a toolbar can be used as a subheader.
 * When toolbars are placed within an `<ion-header>` or `<ion-footer>`,
 * the toolbars stay fixed in their respective location. When placed within
 * `<ion-content>`, toolbars will scroll with the content.
 *
 *
 * ### Buttons in a Toolbar
 * Buttons placed in a toolbar should be placed inside of the `<ion-buttons>`
 * element. An exception to this is a [menuToggle](../../menu/MenuToggle) button.
 * It should not be placed inside of the `<ion-buttons>` element. Both the
 * `<ion-buttons>` element and the `menuToggle` can be positioned inside of the
 * toolbar using different properties. The below chart has a description of each
 * property.
 *
 * | Property    | Description                                                                                                           |
 * |-------------|-----------------------------------------------------------------------------------------------------------------------|
 * | `start`     | Positions element to the left of the content in `ios` mode, and directly to the right in `md` and `wp` mode.    |
 * | `end`       | Positions element to the right of the content in `ios` mode, and to the far right in `md` and `wp` mode.        |
 * | `left`      | Positions element to the left of all other elements.                                                            |
 * | `right`     | Positions element to the right of all other elements.                                                           |
 *
 *
 * ### Header / Footer Box Shadow
 * In `md` mode, the `ion-header` will receive a box-shadow on the bottom, and the
 * `ion-footer` will receive a box-shadow on the top. This can be removed by adding
 * the `no-shadow` attribute to the element.
 *
 * ```html
 * <ion-header no-shadow>
 *   <ion-toolbar>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 *
 * <ion-footer no-shadow>
 *   <ion-toolbar>
 *     <ion-title>Footer</ion-title>
 *   </ion-toolbar>
 * </ion-footer>
 * ```
 *
 * ### Toolbar Borders
 * Toolbars can be stacked up vertically in `<ion-header>`, `<ion-content>`, and
 * `<ion-footer>` elements. In `ios` mode, toolbars have borders on the top and
 * bottom. To hide both borders, the `no-border` attribute should be used on the
 * `ion-toolbar`. To hide the top or bottom border, the `no-border-top` and
 * `no-border-bottom` attribute should be used.
 *
 * ```html
 * <ion-header no-shadow>
 *   <ion-toolbar no-border-bottom>
 *     <ion-title>Header</ion-title>
 *   </ion-toolbar>
 *   <ion-toolbar no-border>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 *   <ion-toolbar no-border-top>
 *     <ion-title>Another Header</ion-title>
 *   </ion-toolbar>
 * </ion-header>
 *
 * <ion-content>
 * </ion-content>
 * ```
 *
 *
 * @usage
 * ```html
 * <ion-header no-shadow>
 *
 *   <ion-toolbar no-border-bottom>
 *     <ion-buttons start>
 *       <button>
 *         <ion-icon name="contact"></ion-icon>
 *       </button>
 *       <button>
 *         <ion-icon name="search"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *     <ion-title>My Toolbar Title</ion-title>
 *   </ion-toolbar>
 *
 *   <ion-toolbar no-border-top>
 *     <ion-title>I'm a subheader</ion-title>
 *   </ion-toolbar>
 *
 * <ion-header>
 *
 *
 * <ion-content>
 *
 *   <ion-toolbar>
 *     <ion-title>Scrolls with the content</ion-title>
 *   </ion-toolbar>
 *
 * </ion-content>
 *
 *
 * <ion-footer>
 *
 *   <ion-toolbar no-border>
 *     <ion-title>I'm a subfooter</ion-title>
 *     <ion-buttons right>
 *       <button>
 *         <ion-icon name="menu"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 *
 *   <ion-toolbar no-border-top>
 *     <ion-title>I'm a footer</ion-title>
 *     <ion-buttons end>
 *       <button>
 *         <ion-icon name="more"></ion-icon>
 *       </button>
 *       <button>
 *         <ion-icon name="options"></ion-icon>
 *       </button>
 *     </ion-buttons>
 *   </ion-toolbar>
 *
 * </ion-footer>
 *  ```
 *
 * @demo /docs/v2/demos/toolbar/
 * @see {@link ../../navbar/Navbar/ Navbar API Docs}
 */
var Toolbar = (function (_super) {
    __extends(Toolbar, _super);
    function Toolbar(viewCtrl, header, footer, config, elementRef) {
        _super.call(this, elementRef);
        if (viewCtrl && (header || footer)) {
            // only toolbars within headers and footer are view toolbars
            // toolbars within the content are not view toolbars, since they
            // are apart of the content, and could be anywhere within the content
            viewCtrl.setToolbarRef(elementRef);
        }
        this._sbPadding = config.getBoolean('statusbarPadding');
    }
    Toolbar = __decorate([
        core_1.Component({
            selector: 'ion-toolbar',
            template: "\n    <div class=\"toolbar-background\"></div>\n    <ng-content select=\"[menuToggle],ion-buttons[left]\"></ng-content>\n    <ng-content select=\"ion-buttons[start]\"></ng-content>\n    <ng-content select=\"ion-buttons[end],ion-buttons[right]\"></ng-content>\n    <div class=\"toolbar-content\">\n      <ng-content></ng-content>\n    </div>\n  ",
            host: {
                'class': 'toolbar',
                '[class.statusbar-padding]': '_sbPadding'
            },
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }),
        __param(0, core_1.Optional()),
        __param(1, core_1.Optional()),
        __param(2, core_1.Optional()), 
        __metadata('design:paramtypes', [view_controller_1.ViewController, Header, Footer, config_1.Config, core_1.ElementRef])
    ], Toolbar);
    return Toolbar;
}(ToolbarBase));
exports.Toolbar = Toolbar;
