import { GestureController } from '../../gestures/gesture-controller';
import { NavControllerBase } from './nav-controller-base';
import { SlideData } from '../../gestures/slide-gesture';
import { SlideEdgeGesture } from '../../gestures/slide-edge-gesture';
export declare class SwipeBackGesture extends SlideEdgeGesture {
    private _nav;
    constructor(element: HTMLElement, options: any, _nav: NavControllerBase, gestureCtlr: GestureController);
    canStart(ev: any): boolean;
    onSlideBeforeStart(slideData: SlideData, ev: any): void;
    onSlide(slide: SlideData): void;
    onSlideEnd(slide: SlideData, ev: any): void;
}
