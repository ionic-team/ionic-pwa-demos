"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var bootstrap_1 = require('../../config/bootstrap');
var animation_1 = require('../../animations/animation');
var backdrop_1 = require('../backdrop/backdrop');
var key_1 = require('../../util/key');
var nav_params_1 = require('../nav/nav-params');
var util_1 = require('../../util/util');
var page_transition_1 = require('../../transitions/page-transition');
var view_controller_1 = require('../nav/view-controller');
var dom_1 = require('../../util/dom');
/**
 * @private
 */
var ModalCmp = (function () {
    function ModalCmp(_compiler, _renderer, _navParams, _viewCtrl) {
        this._compiler = _compiler;
        this._renderer = _renderer;
        this._navParams = _navParams;
        this._viewCtrl = _viewCtrl;
        this.d = _navParams.data.opts;
    }
    ModalCmp.prototype.loadComponent = function (done) {
        var _this = this;
        var componentType = this._navParams.data.componentType;
        bootstrap_1.addSelector(componentType, 'ion-page');
        this._compiler.resolveComponent(componentType).then(function (componentFactory) {
            var componentRef = _this.viewport.createComponent(componentFactory, _this.viewport.length, _this.viewport.parentInjector);
            _this._renderer.setElementClass(componentRef.location.nativeElement, 'show-page', true);
            // auto-add page css className created from component JS class name
            var cssClassName = util_1.pascalCaseToDashCase(componentType.name);
            _this._renderer.setElementClass(componentRef.location.nativeElement, cssClassName, true);
            _this._viewCtrl.setInstance(componentRef.instance);
            _this.enabled = true;
            done();
        });
    };
    ModalCmp.prototype.ngAfterViewInit = function () {
        // intentionally kept empty
    };
    ModalCmp.prototype.dismiss = function (role) {
        return this._viewCtrl.dismiss(null, role);
    };
    ModalCmp.prototype.bdClick = function () {
        if (this.enabled && this.d.enableBackdropDismiss) {
            this.dismiss('backdrop');
        }
    };
    ModalCmp.prototype._keyUp = function (ev) {
        if (this.enabled && this._viewCtrl.isLast() && ev.keyCode === key_1.Key.ESCAPE) {
            this.bdClick();
        }
    };
    __decorate([
        core_1.ViewChild('viewport', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], ModalCmp.prototype, "viewport", void 0);
    __decorate([
        core_1.HostListener('body:keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], ModalCmp.prototype, "_keyUp", null);
    ModalCmp = __decorate([
        core_1.Component({
            selector: 'ion-modal',
            template: "\n    <ion-backdrop disableScroll=\"false\" (click)=\"bdClick($event)\"></ion-backdrop>\n    <div class=\"modal-wrapper\">\n      <div #viewport nav-viewport></div>\n    </div>\n  ",
            directives: [backdrop_1.Backdrop]
        }), 
        __metadata('design:paramtypes', [core_1.ComponentResolver, core_1.Renderer, nav_params_1.NavParams, view_controller_1.ViewController])
    ], ModalCmp);
    return ModalCmp;
}());
exports.ModalCmp = ModalCmp;
/**
 * Animations for modals
 */
var ModalSlideIn = (function (_super) {
    __extends(ModalSlideIn, _super);
    function ModalSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdropEle = ele.querySelector('ion-backdrop');
        var backdrop = new animation_1.Animation(backdropEle);
        var wrapper = new animation_1.Animation(ele.querySelector('.modal-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.4);
        wrapper.fromTo('translateY', '100%', '0%');
        this
            .element(enteringView.pageRef())
            .easing('cubic-bezier(0.36,0.66,0.04,1)')
            .duration(400)
            .add(backdrop)
            .add(wrapper);
        if (enteringView.hasNavbar()) {
            // entering page has a navbar
            var enteringNavBar = new animation_1.Animation(enteringView.navbarRef());
            enteringNavBar.before.addClass('show-navbar');
            this.add(enteringNavBar);
        }
    }
    return ModalSlideIn;
}(page_transition_1.PageTransition));
page_transition_1.PageTransition.register('modal-slide-in', ModalSlideIn);
var ModalSlideOut = (function (_super) {
    __extends(ModalSlideOut, _super);
    function ModalSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapperEle = ele.querySelector('.modal-wrapper');
        var wrapperEleRect = wrapperEle.getBoundingClientRect();
        var wrapper = new animation_1.Animation(wrapperEle);
        // height of the screen - top of the container tells us how much to scoot it down
        // so it's off-screen
        var screenDimensions = dom_1.windowDimensions();
        wrapper.fromTo('translateY', '0px', (screenDimensions.height - wrapperEleRect.top) + "px");
        backdrop.fromTo('opacity', 0.4, 0.0);
        this
            .element(leavingView.pageRef())
            .easing('ease-out')
            .duration(250)
            .add(backdrop)
            .add(wrapper);
    }
    return ModalSlideOut;
}(page_transition_1.PageTransition));
page_transition_1.PageTransition.register('modal-slide-out', ModalSlideOut);
var ModalMDSlideIn = (function (_super) {
    __extends(ModalMDSlideIn, _super);
    function ModalMDSlideIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.modal-wrapper'));
        backdrop.fromTo('opacity', 0.01, 0.4);
        wrapper.fromTo('translateY', '40px', '0px');
        wrapper.fromTo('opacity', 0.01, 1);
        var DURATION = 280;
        var EASING = 'cubic-bezier(0.36,0.66,0.04,1)';
        this.element(enteringView.pageRef()).easing(EASING).duration(DURATION)
            .add(backdrop)
            .add(wrapper);
        if (enteringView.hasNavbar()) {
            // entering page has a navbar
            var enteringNavBar = new animation_1.Animation(enteringView.navbarRef());
            enteringNavBar.before.addClass('show-navbar');
            this.add(enteringNavBar);
        }
    }
    return ModalMDSlideIn;
}(page_transition_1.PageTransition));
page_transition_1.PageTransition.register('modal-md-slide-in', ModalMDSlideIn);
var ModalMDSlideOut = (function (_super) {
    __extends(ModalMDSlideOut, _super);
    function ModalMDSlideOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.modal-wrapper'));
        backdrop.fromTo('opacity', 0.4, 0.0);
        wrapper.fromTo('translateY', '0px', '40px');
        wrapper.fromTo('opacity', 0.99, 0);
        this
            .element(leavingView.pageRef())
            .duration(200)
            .easing('cubic-bezier(0.47,0,0.745,0.715)')
            .add(wrapper)
            .add(backdrop);
    }
    return ModalMDSlideOut;
}(page_transition_1.PageTransition));
page_transition_1.PageTransition.register('modal-md-slide-out', ModalMDSlideOut);
