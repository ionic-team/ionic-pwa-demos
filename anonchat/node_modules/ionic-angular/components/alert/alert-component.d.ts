import { ElementRef, Renderer } from '@angular/core';
import { Config } from '../../config/config';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';
/**
 * @private
 */
export declare class AlertCmp {
    private _viewCtrl;
    private _elementRef;
    private _config;
    private activeId;
    private descId;
    private d;
    private enabled;
    private hdrId;
    private id;
    private inputType;
    private lastClick;
    private msgId;
    private subHdrId;
    constructor(_viewCtrl: ViewController, _elementRef: ElementRef, _config: Config, params: NavParams, renderer: Renderer);
    ionViewLoaded(): void;
    private _keyUp(ev);
    ionViewDidEnter(): void;
    btnClick(button: any, dismissDelay?: number): void;
    rbClick(checkedInput: any): void;
    cbClick(checkedInput: any): void;
    bdClick(): void;
    dismiss(role: any): Promise<any>;
    getValues(): any;
}
