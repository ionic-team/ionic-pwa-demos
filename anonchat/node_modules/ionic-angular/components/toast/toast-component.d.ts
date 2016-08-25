import { AfterViewInit, ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';
/**
* @private
*/
export declare class ToastCmp implements AfterViewInit {
    private _viewCtrl;
    private _config;
    private _elementRef;
    private d;
    private descId;
    private dismissTimeout;
    private enabled;
    private hdrId;
    private id;
    constructor(_viewCtrl: ViewController, _config: Config, _elementRef: ElementRef, params: NavParams, renderer: Renderer);
    ngAfterViewInit(): void;
    ionViewDidEnter(): void;
    cbClick(): void;
    dismiss(role: any): Promise<any>;
}
