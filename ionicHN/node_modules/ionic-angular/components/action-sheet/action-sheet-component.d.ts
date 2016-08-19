import { Renderer, ElementRef } from '@angular/core';
import { Config } from '../../config/config';
import { Form } from '../../util/form';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';
/**
 * @private
 */
export declare class ActionSheetCmp {
    private _viewCtrl;
    private _config;
    private _elementRef;
    private _form;
    private d;
    private descId;
    private enabled;
    private hdrId;
    private id;
    constructor(_viewCtrl: ViewController, _config: Config, _elementRef: ElementRef, _form: Form, params: NavParams, renderer: Renderer);
    ionViewLoaded(): void;
    ionViewDidEnter(): void;
    private _keyUp(ev);
    click(button: any, dismissDelay?: number): void;
    bdClick(): void;
    dismiss(role: any): Promise<any>;
}
