import { ElementRef, NgZone } from '@angular/core';
import { App } from '../app/app';
import { Ion } from '../ion';
import { Config } from '../../config/config';
import { Keyboard } from '../../util/keyboard';
import { Tabs } from '../tabs/tabs';
import { ViewController } from '../nav/view-controller';
/**
 * @name Content
 * @description
 * The Content component provides an easy to use content area with
 * some useful methods to control the scrollable area.
 *
 * The content area can also implement pull-to-refresh with the
 * [Refresher](../../refresher/Refresher) component.
 *
 * @usage
 * ```html
 * <ion-content>
 *   Add your content here!
 * </ion-content>
 * ```
 *
 * To get a reference to the content component from a Page's logic,
 * you can use Angular's `@ViewChild` annotation:
 *
 * ```ts
 * import { Component, ViewChild } from '@angular/core';
 * import { Content } from 'ionic-angular';
 *
 * @Component({...})
 * export class MyPage{
 *   @ViewChild(Content) content: Content;
 *
 *   scrollToTop() {
 *     this.content.scrollToTop();
 *   }
 * }
 * ```
 *
 * @advanced
 *
 * Resizing the content
 *
 *
 * ```ts
 * @Component({
 *   template: `
 *     <ion-header>
 *       <ion-navbar>
 *         <ion-title>Main Navbar</ion-title>
 *       </ion-navbar>
 *       <ion-toolbar *ngIf="showToolbar">
 *         <ion-title>Dynamic Toolbar</ion-title>
 *       </ion-toolbar>
 *     </ion-header>
 *     <ion-content>
 *       <button (click)="toggleToolbar()">Toggle Toolbar</button>
 *     </ion-content>
 * `})
 *
 * class E2EPage {
 *   @ViewChild(Content) content: Content;
 *   showToolbar: boolean = false;
 *
 *   toggleToolbar() {
 *     this.showToolbar = !this.showToolbar;
 *     this.content.resize();
 *   }
 * }
 * ```
 *
 *
 * Scroll to a specific position
 *
 * ```ts
 * import { Component, ViewChild } from '@angular/core';
 * import { Content } from 'ionic-angular';
 *
 * @Component({
 *   template: `<ion-content>
 *                <button (click)="scrollTo()">Down 500px</button>
 *              </ion-content>`
 * )}
 * export class MyPage{
 *   @ViewChild(Content) content: Content;
 *
 *   scrollTo() {
 *     // set the scrollLeft to 0px, and scrollTop to 500px
 *     // the scroll duration should take 200ms
 *     this.content.scrollTo(0, 500, 200);
 *   }
 * }
 * ```
 *
 */
export declare class Content extends Ion {
    private _elementRef;
    private _app;
    private _keyboard;
    private _zone;
    private _tabs;
    private _paddingTop;
    private _paddingRight;
    private _paddingBottom;
    private _paddingLeft;
    private _scrollPadding;
    private _headerHeight;
    private _footerHeight;
    private _tabbarHeight;
    private _tabsPlacement;
    private _inputPolling;
    private _scroll;
    private _scLsn;
    private _sbPadding;
    private _fullscreen;
    private _scrollEle;
    private _footerEle;
    /**
     * A number representing how many pixels the top of the content has been
     * adjusted, which could be by either padding or margin.
     */
    contentTop: number;
    /**
     * A number representing how many pixels the bottom of the content has been
     * adjusted, which could be by either padding or margin.
     */
    contentBottom: number;
    constructor(_elementRef: ElementRef, config: Config, _app: App, _keyboard: Keyboard, _zone: NgZone, viewCtrl: ViewController, _tabs: Tabs);
    /**
     * @private
     */
    ngOnInit(): void;
    /**
     * @private
     */
    ngOnDestroy(): void;
    /**
     * @private
     */
    addScrollListener(handler: any): Function;
    /**
     * @private
     */
    addTouchStartListener(handler: any): Function;
    /**
     * @private
     */
    addTouchMoveListener(handler: any): Function;
    /**
     * @private
     */
    addTouchEndListener(handler: any): Function;
    /**
     * @private
     */
    addMouseDownListener(handler: any): Function;
    /**
     * @private
     */
    addMouseUpListener(handler: any): Function;
    /**
     * @private
     */
    addMouseMoveListener(handler: any): Function;
    private _addListener(type, handler);
    /**
     * @private
     */
    getScrollElement(): HTMLElement;
    /**
     * @private
     * Call a method when scrolling has stopped
     * @param {Function} callback The method you want perform when scrolling has ended
     */
    onScrollEnd(callback: Function): void;
    /**
     * @private
     */
    onScrollElementTransitionEnd(callback: Function): void;
    /**
     * Scroll to the specified position.
     *
     * @param {number} x  The x-value to scroll to.
     * @param {number} y  The y-value to scroll to.
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollTo(x: number, y: number, duration?: number): Promise<any>;
    /**
     * Scroll to the top of the content component.
     *
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollToTop(duration?: number): Promise<any>;
    /**
     * Get the `scrollTop` property of the content's scrollable element.
     * @returns {number}
     */
    getScrollTop(): number;
    /**
     * Set the `scrollTop` property of the content's scrollable element.
     * @param {number} top
     */
    setScrollTop(top: number): void;
    /**
     * Scroll to the bottom of the content component.
     * @param {number} [duration]  Duration of the scroll animation in milliseconds. Defaults to `300`.
     * @returns {Promise} Returns a promise which is resolved when the scroll has completed.
     */
    scrollToBottom(duration?: number): Promise<any>;
    /**
     * @private
     */
    jsScroll(onScrollCallback: Function): Function;
    /**
     * @private
     * DOM WRITE
     */
    addCssClass(className: string): void;
    /**
     * @input {boolean} By default, content is positioned between the headers
     * and footers. However, using `fullscreen="true"`, the content will be
     * able to scroll "under" the headers and footers. At first glance the
     * fullscreen option may not look any different than the default, however,
     * by adding a transparency effect to a header then the content can be
     * seen under the header as the user scrolls.
     */
    fullscreen: boolean;
    /**
     * @private
     * DOM WRITE
     */
    removeCssClass(className: string): void;
    /**
     * @private
     * DOM WRITE
     */
    setScrollElementStyle(prop: string, val: any): void;
    /**
     * Returns the content and scroll elements' dimensions.
     * @returns {object} dimensions  The content and scroll elements' dimensions
     * {number} dimensions.contentHeight  content offsetHeight
     * {number} dimensions.contentTop  content offsetTop
     * {number} dimensions.contentBottom  content offsetTop+offsetHeight
     * {number} dimensions.contentWidth  content offsetWidth
     * {number} dimensions.contentLeft  content offsetLeft
     * {number} dimensions.contentRight  content offsetLeft + offsetWidth
     * {number} dimensions.scrollHeight  scroll scrollHeight
     * {number} dimensions.scrollTop  scroll scrollTop
     * {number} dimensions.scrollBottom  scroll scrollTop + scrollHeight
     * {number} dimensions.scrollWidth  scroll scrollWidth
     * {number} dimensions.scrollLeft  scroll scrollLeft
     * {number} dimensions.scrollRight  scroll scrollLeft + scrollWidth
     */
    getContentDimensions(): {
        contentHeight: number;
        contentTop: number;
        contentBottom: number;
        contentWidth: number;
        contentLeft: number;
        contentRight: number;
        scrollHeight: number;
        scrollTop: number;
        scrollBottom: number;
        scrollWidth: number;
        scrollLeft: number;
        scrollRight: number;
    };
    /**
     * @private
     * DOM WRITE
     * Adds padding to the bottom of the scroll element when the keyboard is open
     * so content below the keyboard can be scrolled into view.
     */
    addScrollPadding(newPadding: number): void;
    /**
     * @private
     * DOM WRITE
     */
    clearScrollPaddingFocusOut(): void;
    /**
     * Tell the content to recalculate its dimensions. This should be called
     * after dynamically adding headers, footers, or tabs.
     *
     */
    resize(): void;
    /**
     * @private
     * DOM READ
     */
    readDimensions(): void;
    /**
     * @private
     * DOM WRITE
     */
    writeDimensions(): void;
}
