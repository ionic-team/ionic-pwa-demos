import { ComponentResolver, Renderer, ViewContainerRef } from '@angular/core';
import { NavParams } from '../nav/nav-params';
import { ViewController } from '../nav/view-controller';
/**
 * @private
 */
export declare class ModalCmp {
    private _compiler;
    private _renderer;
    private _navParams;
    private _viewCtrl;
    viewport: ViewContainerRef;
    private d;
    private enabled;
    constructor(_compiler: ComponentResolver, _renderer: Renderer, _navParams: NavParams, _viewCtrl: ViewController);
    loadComponent(done: Function): void;
    ngAfterViewInit(): void;
    dismiss(role: any): Promise<any>;
    bdClick(): void;
    private _keyUp(ev);
}
