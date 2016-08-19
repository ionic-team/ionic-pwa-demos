import { ElementRef, EventEmitter } from '@angular/core';
import { NgControl } from '@angular/forms';
import { App } from '../app/app';
import { Coordinates } from '../../util/dom';
import { Config } from '../../config/config';
import { Content } from '../content/content';
import { Form } from '../../util/form';
import { Item } from '../item/item';
import { NativeInput } from './native-input';
import { NavController } from '../nav/nav-controller';
import { NavControllerBase } from '../nav/nav-controller-base';
import { Platform } from '../../platform/platform';
export declare class InputBase {
    protected _form: Form;
    protected _item: Item;
    protected _app: App;
    protected _platform: Platform;
    protected _elementRef: ElementRef;
    protected _scrollView: Content;
    protected _coord: Coordinates;
    protected _deregScroll: Function;
    protected _disabled: boolean;
    protected _keyboardHeight: number;
    protected _scrollMove: EventListener;
    protected _type: string;
    protected _useAssist: boolean;
    protected _usePadding: boolean;
    protected _value: any;
    protected _isTouch: boolean;
    protected _autoFocusAssist: string;
    protected _autoComplete: string;
    protected _autoCorrect: string;
    protected _nav: NavControllerBase;
    inputControl: NgControl;
    clearInput: any;
    placeholder: string;
    protected _native: NativeInput;
    blur: EventEmitter<Event>;
    focus: EventEmitter<Event>;
    constructor(config: Config, _form: Form, _item: Item, _app: App, _platform: Platform, _elementRef: ElementRef, _scrollView: Content, nav: NavController, ngControl: NgControl);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterContentChecked(): void;
    private setItemInputControlCss();
    private setControlCss(element, control);
    ngOnDestroy(): void;
    value: any;
    type: string;
    disabled: boolean;
    /**
     * @private
     */
    private _nativeInput;
    /**
     * @private
     */
    private _nextInput;
    /**
     * @private
     * Angular2 Forms API method called by the model (Control) on change to update
     * the checked value.
     * https://github.com/angular/angular/blob/master/modules/angular2/src/forms/directives/shared.ts#L34
     */
    writeValue(val: any): void;
    /**
     * @private
     */
    onChange(val: any): void;
    /**
     * @private
     */
    onTouched(val: any): void;
    /**
     * @private
     */
    hasFocus(): boolean;
    /**
     * @private
     */
    checkHasValue(inputValue: any): void;
    /**
     * @private
     */
    focusChange(inputHasFocus: boolean): void;
    private pointerStart(ev);
    private pointerEnd(ev);
    /**
     * @private
     */
    initFocus(): void;
    /**
     * @private
     */
    private setFocus();
    /**
     * @private
     * Angular2 Forms API method called by the view (formControlName) to register the
     * onChange event handler that updates the model (Control).
     * @param {Function} fn  the onChange event handler.
     */
    registerOnChange(fn: any): void;
    /**
     * @private
     * Angular2 Forms API method called by the view (formControlName) to register
     * the onTouched event handler that marks model (Control) as touched.
     * @param {Function} fn  onTouched event handler.
     */
    registerOnTouched(fn: any): void;
    /**
     * @private
     */
    private regScrollMove();
    /**
     * @private
     */
    private deregScrollMove();
    focusNext(): void;
    /**
     * @private
     */
    static getScrollData(inputOffsetTop: number, inputOffsetHeight: number, scrollViewDimensions: any, keyboardHeight: number, plaformHeight: number): {
        scrollAmount: number;
        scrollTo: number;
        scrollPadding: number;
        inputSafeY: number;
    };
}
