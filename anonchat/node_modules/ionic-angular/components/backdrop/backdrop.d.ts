import { ElementRef } from '@angular/core';
import { GestureController } from '../../gestures/gesture-controller';
/**
 * @private
 */
export declare class Backdrop {
    private _gestureCtrl;
    private _elementRef;
    private _gestureID;
    disableScroll: boolean;
    constructor(_gestureCtrl: GestureController, _elementRef: ElementRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    getNativeElement(): HTMLElement;
}
