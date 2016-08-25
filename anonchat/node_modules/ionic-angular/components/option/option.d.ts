import { ElementRef, EventEmitter } from '@angular/core';
/**
 * @name Option
 * @description
 * `ion-option` is a child component of `ion-select`. Similar to the native option element, `ion-option` can take a value and a selected property.
 *
 * @demo /docs/v2/demos/select/
 */
export declare class Option {
    private _elementRef;
    private _selected;
    private _disabled;
    private _value;
    /**
     * @input {any} Event to evaluate when option is selected
     */
    ionSelect: EventEmitter<any>;
    constructor(_elementRef: ElementRef);
    /**
     * @input {boolean} Whether or not the option is already selected
     */
    selected: any;
    /**
     * @input {any} The value of the option
     */
    value: any;
    /**
     * @input {boolean} Whether or not the option is disabled
     */
    disabled: any;
    /**
     * @private
     */
    text: any;
}
