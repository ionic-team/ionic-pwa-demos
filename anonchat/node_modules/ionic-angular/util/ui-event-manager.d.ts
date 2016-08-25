import { ElementRef } from '@angular/core';
export interface PointerEventsConfig {
    element?: HTMLElement;
    elementRef?: ElementRef;
    pointerDown: (ev: any) => boolean;
    pointerMove: (ev: any) => void;
    pointerUp: (ev: any) => void;
    nativeOptions?: any;
    zone?: boolean;
}
/**
 * @private
 */
export declare class PointerEvents {
    private ele;
    private pointerDown;
    private pointerMove;
    private pointerUp;
    private zone;
    private option;
    private rmTouchStart;
    private rmTouchMove;
    private rmTouchEnd;
    private rmTouchCancel;
    private rmMouseStart;
    private rmMouseMove;
    private rmMouseUp;
    private bindTouchEnd;
    private bindMouseUp;
    private lastTouchEvent;
    mouseWait: number;
    constructor(ele: any, pointerDown: any, pointerMove: any, pointerUp: any, zone: boolean, option: any);
    private handleTouchStart(ev);
    private handleMouseDown(ev);
    private handleTouchEnd(ev);
    private handleMouseUp(ev);
    private stopTouch();
    private stopMouse();
    stop(): void;
    destroy(): void;
}
/**
 * @private
 */
export declare class UIEventManager {
    zoneWrapped: boolean;
    private events;
    constructor(zoneWrapped?: boolean);
    listenRef(ref: ElementRef, eventName: string, callback: any, option?: any): Function;
    pointerEvents(config: PointerEventsConfig): PointerEvents;
    listen(element: any, eventName: string, callback: any, option?: any): Function;
    unlistenAll(): void;
}
