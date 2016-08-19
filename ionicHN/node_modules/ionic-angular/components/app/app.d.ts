import { ComponentResolver, EventEmitter, Renderer } from '@angular/core';
import { ClickBlock } from '../../util/click-block';
import { Config } from '../../config/config';
import { NavController } from '../nav/nav-controller';
import { NavOptions } from '../nav/nav-interfaces';
import { NavPortal } from '../nav/nav-portal';
import { Platform } from '../../platform/platform';
/**
 * @private
 */
export declare abstract class UserComponent {
}
/**
 * Ionic App utility service.
 */
export declare class App {
    private _config;
    private _platform;
    private _disTime;
    private _scrollTime;
    private _title;
    private _titleSrv;
    private _rootNav;
    private _portal;
    /**
     * @private
     */
    clickBlock: ClickBlock;
    /**
     * @private
     */
    appRoot: AppRoot;
    viewDidLoad: EventEmitter<any>;
    viewWillEnter: EventEmitter<any>;
    viewDidEnter: EventEmitter<any>;
    viewWillLeave: EventEmitter<any>;
    viewDidLeave: EventEmitter<any>;
    viewWillUnload: EventEmitter<any>;
    viewDidUnload: EventEmitter<any>;
    constructor(_config: Config, _platform: Platform);
    /**
     * Sets the document title.
     * @param {string} val  Value to set the document title to.
     */
    setTitle(val: string): void;
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
    setEnabled(isEnabled: boolean, duration?: number): void;
    /**
     * @private
     */
    setScrollDisabled(disableScroll: boolean): void;
    /**
     * @private
     * Boolean if the app is actively enabled or not.
     * @return {boolean}
     */
    isEnabled(): boolean;
    /**
     * @private
     */
    setScrolling(): void;
    /**
     * Boolean if the app is actively scrolling or not.
     * @return {boolean}
     */
    isScrolling(): boolean;
    /**
     * @private
     */
    getActiveNav(): NavController;
    /**
     * @private
     */
    getRootNav(): NavController;
    /**
     * @private
     */
    setRootNav(nav: any): void;
    /**
     * @private
     */
    setPortal(portal: NavPortal): void;
    /**
     * @private
     */
    present(enteringView: any, opts?: NavOptions): Promise<any>;
    /**
     * @private
     */
    navPop(): Promise<any>;
    /**
     * @private
     */
    private getRegisteredComponent(cls);
    /**
     * @private
     */
    private getComponent(id);
    /**
     * Get an instance of the global app injector that contains references to all of the instantiated providers
     * @returns {Injector}
     */
    private getAppInjector();
}
/**
 * @private
 */
export declare class AppRoot {
    private _cmp;
    private _cr;
    private _renderer;
    private _viewport;
    constructor(_cmp: UserComponent, _cr: ComponentResolver, _renderer: Renderer, app: App);
    ngAfterViewInit(): void;
    disableScroll: boolean;
}
