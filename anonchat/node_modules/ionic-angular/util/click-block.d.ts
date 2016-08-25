import { ElementRef, Renderer } from '@angular/core';
import { App } from '../components/app/app';
import { Config } from '../config/config';
/**
 * @private
 */
export declare class ClickBlock {
    private elementRef;
    private renderer;
    private _tmrId;
    private _showing;
    isEnabled: boolean;
    constructor(app: App, config: Config, elementRef: ElementRef, renderer: Renderer);
    activate(shouldShow: boolean, expire: number): void;
}
