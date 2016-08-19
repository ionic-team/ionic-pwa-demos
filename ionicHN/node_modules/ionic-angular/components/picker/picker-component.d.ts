import { ElementRef, EventEmitter, Renderer } from '@angular/core';
import { DomSanitizationService } from '@angular/platform-browser';
import { Config } from '../../config/config';
import { NavParams } from '../nav/nav-params';
import { PickerColumn } from './picker-options';
import { UIEventManager } from '../../util/ui-event-manager';
import { ViewController } from '../nav/view-controller';
/**
 * @private
 */
export declare class PickerColumnCmp {
    private elementRef;
    private _sanitizer;
    colEle: ElementRef;
    col: PickerColumn;
    y: number;
    colHeight: number;
    optHeight: number;
    velocity: number;
    pos: number[];
    startY: number;
    rafId: number;
    bounceFrom: number;
    minY: number;
    maxY: number;
    rotateFactor: number;
    lastIndex: number;
    receivingEvents: boolean;
    events: UIEventManager;
    ionChange: EventEmitter<any>;
    constructor(config: Config, elementRef: ElementRef, _sanitizer: DomSanitizationService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    pointerStart(ev: UIEvent): boolean;
    pointerMove(ev: UIEvent): void;
    pointerEnd(ev: UIEvent): void;
    decelerate(): void;
    optClick(ev: UIEvent, index: number): void;
    setSelected(selectedIndex: number, duration: number): void;
    update(y: number, duration: number, saveY: boolean, emitChange: boolean): void;
    refresh(): void;
}
/**
 * @private
 */
export declare class PickerCmp {
    private _viewCtrl;
    private _elementRef;
    private _config;
    private _cols;
    private d;
    private enabled;
    private lastClick;
    private id;
    constructor(_viewCtrl: ViewController, _elementRef: ElementRef, _config: Config, params: NavParams, renderer: Renderer);
    ionViewLoaded(): void;
    refresh(): void;
    private _colChange(selectedOption);
    private _keyUp(ev);
    ionViewDidEnter(): void;
    btnClick(button: any, dismissDelay?: number): void;
    bdClick(): void;
    dismiss(role: any): Promise<any>;
    getSelected(): any;
}
