import { ComponentResolver, ElementRef, EventEmitter, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { GestureController } from '../../gestures/gesture-controller';
import { Ion } from '../ion';
import { Keyboard } from '../../util/keyboard';
import { NavController } from './nav-controller';
import { NavOptions } from './nav-interfaces';
import { SwipeBackGesture } from './swipe-back';
import { Transition } from '../../transitions/transition';
import { ViewController } from './view-controller';
/**
 * This class is for internal use only. It is not exported publicly.
 */
export declare class NavControllerBase extends Ion implements NavController {
    _app: App;
    _keyboard: Keyboard;
    _zone: NgZone;
    _renderer: Renderer;
    _compiler: ComponentResolver;
    _gestureCtrl: GestureController;
    _transIds: number;
    _init: boolean;
    _isPortal: boolean;
    _trans: Transition;
    _sbGesture: SwipeBackGesture;
    _sbThreshold: number;
    _viewport: ViewContainerRef;
    _children: any[];
    _sbEnabled: boolean;
    _ids: number;
    _trnsDelay: any;
    _views: ViewController[];
    viewDidLoad: EventEmitter<any>;
    viewWillEnter: EventEmitter<any>;
    viewDidEnter: EventEmitter<any>;
    viewWillLeave: EventEmitter<any>;
    viewDidLeave: EventEmitter<any>;
    viewWillUnload: EventEmitter<any>;
    viewDidUnload: EventEmitter<any>;
    id: string;
    parent: any;
    config: Config;
    trnsTime: number;
    constructor(parent: any, _app: App, config: Config, _keyboard: Keyboard, elementRef: ElementRef, _zone: NgZone, _renderer: Renderer, _compiler: ComponentResolver, _gestureCtrl: GestureController);
    setViewport(val: ViewContainerRef): void;
    setRoot(page: any, params?: any, opts?: NavOptions): Promise<any>;
    setPages(pages: Array<{
        page: any;
        params?: any;
    }>, opts?: NavOptions): Promise<any>;
    push(page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;
    /**
     * DEPRECATED: Please use inject the overlays controller and use the present method on the instance instead.
     */
    private present(enteringView, opts?);
    insert(insertIndex: number, page: any, params?: any, opts?: NavOptions, done?: Function): Promise<any>;
    insertPages(insertIndex: number, insertPages: Array<{
        page: any;
        params?: any;
    }>, opts?: NavOptions, done?: Function): Promise<any>;
    insertViews(insertIndex: number, insertViews: ViewController[], opts?: NavOptions, done?: Function): Promise<any>;
    _insert(insertIndex: number, insertViews: ViewController[]): ViewController;
    pop(opts?: NavOptions, done?: Function): Promise<any>;
    popToRoot(opts?: NavOptions, done?: Function): Promise<any>;
    popTo(view: ViewController, opts?: NavOptions, done?: Function): Promise<any>;
    remove(startIndex?: number, removeCount?: number, opts?: NavOptions, done?: Function): Promise<any>;
    /**
     * @private
     */
    _remove(startIndex: number, removeCount: number): ViewController;
    /**
     * @private
     */
    _transition(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function): void;
    /**
     * @private
     */
    _setAnimate(opts: NavOptions): void;
    /**
     * @private
     */
    _render(transId: number, enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function): any;
    /**
     * @private
     */
    _postRender(transId: number, enteringView: ViewController, leavingView: ViewController, isAlreadyTransitioning: boolean, opts: NavOptions, done: Function): any;
    /**
     * @private
     */
    _beforeTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, done: Function): any;
    /**
     * @private
     */
    _afterTrans(enteringView: ViewController, leavingView: ViewController, opts: NavOptions, hasCompleted: boolean, done: Function): void;
    /**
     * @private
     */
    _transFinish(transId: number, enteringView: ViewController, leavingView: ViewController, direction: string, updateUrl: boolean, hasCompleted: boolean): void;
    /**
     *@private
     * This method is just a wrapper to the Transition function of same name
     * to make it easy/possible to mock the method call by overriding the function.
     * In testing we don't want to actually do the animation, we want to return a stub instead
     */
    _createTrans(enteringView: ViewController, leavingView: ViewController, transitionOpts: any): Transition;
    _cleanup(): void;
    getActiveChildNav(): any;
    /**
     * @private
     */
    registerChildNav(nav: any): void;
    /**
     * @private
     */
    unregisterChildNav(nav: any): void;
    /**
     * @private
     */
    ngOnDestroy(): void;
    /**
     * @private
     */
    loadPage(view: ViewController, viewport: ViewContainerRef, opts: NavOptions, done: Function): void;
    /**
     * @private
     */
    swipeBackStart(): void;
    /**
     * @private
     */
    swipeBackProgress(stepValue: number): void;
    /**
     * @private
     */
    swipeBackEnd(shouldComplete: boolean, currentStepValue: number): void;
    /**
     * @private
     */
    _sbCheck(): void;
    canSwipeBack(): boolean;
    canGoBack(): boolean;
    isTransitioning(includeAncestors?: boolean): boolean;
    setTransitioning(isTransitioning: boolean, fallback?: number): void;
    getLongestTrans(now: number): number;
    getByState(state: number): ViewController;
    getByIndex(index: number): ViewController;
    getActive(): ViewController;
    isActive(view: ViewController): boolean;
    getPrevious(view: ViewController): ViewController;
    first(): ViewController;
    last(): ViewController;
    indexOf(view: ViewController): number;
    length(): number;
    isSwipeBackEnabled(): boolean;
    /**
     * DEPRECATED: Please use app.getRootNav() instead
     */
    private rootNav;
    /**
     * @private
     * Dismiss all pages which have set the `dismissOnPageChange` property.
     */
    dismissPageChangeViews(): void;
    /**
     * @private
     */
    _setZIndex(enteringView: ViewController, leavingView: ViewController, direction: string): void;
}
export declare const isTabs: (nav: any) => boolean;
export declare const isTab: (nav: any) => boolean;
export declare const isNav: (nav: any) => boolean;
export declare const STATE_ACTIVE: number;
export declare const STATE_INACTIVE: number;
export declare const STATE_INIT_ENTER: number;
export declare const STATE_INIT_LEAVE: number;
export declare const STATE_TRANS_ENTER: number;
export declare const STATE_TRANS_LEAVE: number;
export declare const STATE_REMOVE: number;
export declare const STATE_REMOVE_AFTER_TRANS: number;
export declare const STATE_CANCEL_ENTER: number;
export declare const STATE_FORCE_ACTIVE: number;
