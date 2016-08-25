import { List } from '../list/list';
import { PanGesture } from '../../gestures/drag-gesture';
export declare class ItemSlidingGesture extends PanGesture {
    list: List;
    private preSelectedContainer;
    private selectedContainer;
    private openContainer;
    private firstCoordX;
    private firstTimestamp;
    constructor(list: List);
    canStart(ev: any): boolean;
    onDragStart(ev: any): void;
    onDragMove(ev: any): void;
    onDragEnd(ev: any): void;
    notCaptured(ev: any): void;
    closeOpened(): boolean;
    destroy(): void;
}
