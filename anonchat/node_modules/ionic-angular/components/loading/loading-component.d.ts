import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';
/**
* @private
*/
export declare class LoadingCmp {
    private _viewCtrl;
    private _config;
    private _elementRef;
    private d;
    private id;
    private showSpinner;
    private durationTimeout;
    constructor(_viewCtrl: ViewController, _config: Config, _elementRef: ElementRef, params: NavParams, renderer: Renderer);
    ngOnInit(): void;
    ionViewDidEnter(): void;
    dismiss(role: any): Promise<any>;
}
