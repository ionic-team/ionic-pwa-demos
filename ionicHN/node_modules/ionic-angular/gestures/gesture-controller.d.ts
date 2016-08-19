import { App } from '../components/app/app';
export declare const enum GesturePriority {
    Minimun = -10000,
    VeryLow = -20,
    Low = -10,
    Normal = 0,
    High = 10,
    VeryHigh = 20,
    SlidingItem = -10,
    MenuSwipe = 10,
    GoBackSwipe = 20,
    Refresher = 0,
}
export declare const enum DisableScroll {
    Never = 0,
    DuringCapture = 1,
    Always = 2,
}
export interface GestureOptions {
    disable?: string[];
    disableScroll?: DisableScroll;
    priority?: number;
}
export declare class GestureController {
    private _app;
    private id;
    private requestedStart;
    private disabledGestures;
    private disabledScroll;
    private capturedID;
    constructor(_app: App);
    create(name: string, opts?: GestureOptions): GestureDelegate;
    newID(): number;
    start(gestureName: string, id: number, priority: number): boolean;
    capture(gestureName: string, id: number, priority: number): boolean;
    release(id: number): void;
    disableGesture(gestureName: string, id: number): void;
    enableGesture(gestureName: string, id: number): void;
    disableScroll(id: number): void;
    enableScroll(id: number): void;
    canStart(gestureName: string): boolean;
    isCaptured(): boolean;
    isScrollDisabled(): boolean;
    isDisabled(gestureName: string): boolean;
}
export declare class GestureDelegate {
    private name;
    private id;
    private controller;
    private disable;
    private disableScroll;
    priority: number;
    constructor(name: string, id: number, controller: GestureController, opts: GestureOptions);
    canStart(): boolean;
    start(): boolean;
    capture(): boolean;
    release(): void;
    destroy(): void;
}
