import { ComponentResolver, ElementRef, Renderer, ViewContainerRef } from '@angular/core';
import { Config } from '../../config/config';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';
/**
 * @private
 */
export declare class PopoverCmp {
    private _compiler;
    private _elementRef;
    private _renderer;
    private _config;
    private _navParams;
    private _viewCtrl;
    viewport: ViewContainerRef;
    private d;
    private enabled;
    private id;
    private showSpinner;
    constructor(_compiler: ComponentResolver, _elementRef: ElementRef, _renderer: Renderer, _config: Config, _navParams: NavParams, _viewCtrl: ViewController);
    ionViewWillEnter(): void;
    ngAfterViewInit(): void;
    dismiss(role: any): Promise<any>;
    bdTouch(ev: UIEvent): void;
    bdClick(): void;
    private _keyUp(ev);
}
