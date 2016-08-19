import { GestureDelegate } from '../gestures/gesture-controller';
/**
 * @private
 */
export interface PanGestureConfig {
    threshold?: number;
    maxAngle?: number;
    direction?: 'x' | 'y';
    gesture?: GestureDelegate;
}
/**
 * @private
 */
export declare class PanGesture {
    private element;
    private dragging;
    private events;
    private pointerEvents;
    private detector;
    private started;
    private captured;
    isListening: boolean;
    protected gestute: GestureDelegate;
    protected direction: string;
    constructor(element: HTMLElement, opts?: PanGestureConfig);
    listen(): void;
    unlisten(): void;
    destroy(): void;
    pointerDown(ev: any): boolean;
    pointerMove(ev: any): void;
    pointerUp(ev: any): void;
    getNativeElement(): HTMLElement;
    canStart(ev: any): boolean;
    canCapture(ev: any): boolean;
    onDragStart(ev: any): void;
    onDragMove(ev: any): void;
    onDragEnd(ev: any): void;
    notCaptured(ev: any): void;
}
