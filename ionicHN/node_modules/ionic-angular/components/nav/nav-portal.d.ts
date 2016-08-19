import { ComponentResolver, ElementRef, NgZone, Renderer, ViewContainerRef } from '@angular/core';
import { App } from '../app/app';
import { Config } from '../../config/config';
import { GestureController } from '../../gestures/gesture-controller';
import { Keyboard } from '../../util/keyboard';
import { NavControllerBase } from '../nav/nav-controller-base';
/**
 * @private
 */
export declare class NavPortal extends NavControllerBase {
    constructor(app: App, config: Config, keyboard: Keyboard, elementRef: ElementRef, zone: NgZone, renderer: Renderer, compiler: ComponentResolver, gestureCtrl: GestureController, viewPort: ViewContainerRef);
}
