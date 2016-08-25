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
var config_1 = require('../../config/config');
var dom_1 = require('../../util/dom');
var key_1 = require('../../util/key');
var nav_params_1 = require('../nav/nav-params');
var page_transition_1 = require('../../transitions/page-transition');
var view_controller_1 = require('../nav/view-controller');
/**
 * @private
 */
var PopoverCmp = (function () {
    function PopoverCmp(_compiler, _elementRef, _renderer, _config, _navParams, _viewCtrl) {
        this._compiler = _compiler;
        this._elementRef = _elementRef;
        this._renderer = _renderer;
        this._config = _config;
        this._navParams = _navParams;
        this._viewCtrl = _viewCtrl;
        this.d = _navParams.data.opts;
        if (this.d.cssClass) {
            _renderer.setElementClass(_elementRef.nativeElement, this.d.cssClass, true);
        }
        this.id = (++popoverIds);
    }
    PopoverCmp.prototype.ionViewWillEnter = function () {
        var _this = this;
        bootstrap_1.addSelector(this._navParams.data.componentType, 'ion-popover-inner');
        this._compiler.resolveComponent(this._navParams.data.componentType).then(function (componentFactory) {
            var componentRef = _this.viewport.createComponent(componentFactory, _this.viewport.length, _this.viewport.parentInjector);
            _this._viewCtrl.setInstance(componentRef.instance);
            // manually fire ionViewWillEnter() since PopoverCmp's ionViewWillEnter already happened
            _this._viewCtrl.fireWillEnter();
        });
    };
    PopoverCmp.prototype.ngAfterViewInit = function () {
        var activeElement = document.activeElement;
        if (document.activeElement) {
            activeElement.blur();
        }
        this.enabled = true;
    };
    PopoverCmp.prototype.dismiss = function (role) {
        return this._viewCtrl.dismiss(null, role);
    };
    PopoverCmp.prototype.bdTouch = function (ev) {
        ev.preventDefault();
        ev.stopPropagation();
    };
    PopoverCmp.prototype.bdClick = function () {
        if (this.enabled && this.d.enableBackdropDismiss) {
            this.dismiss('backdrop');
        }
    };
    PopoverCmp.prototype._keyUp = function (ev) {
        if (this.enabled && ev.keyCode === key_1.Key.ESCAPE && this._viewCtrl.isLast()) {
            this.bdClick();
        }
    };
    __decorate([
        core_1.ViewChild('viewport', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], PopoverCmp.prototype, "viewport", void 0);
    __decorate([
        core_1.HostListener('body:keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [KeyboardEvent]), 
        __metadata('design:returntype', void 0)
    ], PopoverCmp.prototype, "_keyUp", null);
    PopoverCmp = __decorate([
        core_1.Component({
            selector: 'ion-popover',
            template: "\n    <ion-backdrop (click)=\"bdClick($event)\" [class.hide-backdrop]=\"!d.showBackdrop\"></ion-backdrop>\n    <div class=\"popover-wrapper\">\n      <div class=\"popover-arrow\"></div>\n      <div class=\"popover-content\">\n        <div class=\"popover-viewport\">\n          <div #viewport nav-viewport></div>\n        </div>\n      </div>\n    </div>\n  ",
            directives: [backdrop_1.Backdrop]
        }), 
        __metadata('design:paramtypes', [core_1.ComponentResolver, core_1.ElementRef, core_1.Renderer, config_1.Config, nav_params_1.NavParams, view_controller_1.ViewController])
    ], PopoverCmp);
    return PopoverCmp;
}());
exports.PopoverCmp = PopoverCmp;
/**
 * Animations for popover
 */
var PopoverTransition = (function (_super) {
    __extends(PopoverTransition, _super);
    function PopoverTransition(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
    }
    PopoverTransition.prototype.mdPositionView = function (nativeEle, ev) {
        var originY = 'top';
        var originX = 'left';
        var popoverWrapperEle = nativeEle.querySelector('.popover-wrapper');
        // Popover content width and height
        var popoverEle = nativeEle.querySelector('.popover-content');
        var popoverDim = popoverEle.getBoundingClientRect();
        var popoverWidth = popoverDim.width;
        var popoverHeight = popoverDim.height;
        // Window body width and height
        var bodyWidth = window.innerWidth;
        var bodyHeight = window.innerHeight;
        // If ev was passed, use that for target element
        var targetDim = ev && ev.target && ev.target.getBoundingClientRect();
        var targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
        var targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2) - (popoverWidth / 2);
        var targetWidth = targetDim && targetDim.width || 0;
        var targetHeight = targetDim && targetDim.height || 0;
        var popoverCSS = {
            top: targetTop,
            left: targetLeft
        };
        // If the popover left is less than the padding it is off screen
        // to the left so adjust it, else if the width of the popover
        // exceeds the body width it is off screen to the right so adjust
        if (popoverCSS.left < POPOVER_MD_BODY_PADDING) {
            popoverCSS.left = POPOVER_MD_BODY_PADDING;
        }
        else if (popoverWidth + POPOVER_MD_BODY_PADDING + popoverCSS.left > bodyWidth) {
            popoverCSS.left = bodyWidth - popoverWidth - POPOVER_MD_BODY_PADDING;
            originX = 'right';
        }
        // If the popover when popped down stretches past bottom of screen,
        // make it pop up if there's room above
        if (targetTop + targetHeight + popoverHeight > bodyHeight && targetTop - popoverHeight > 0) {
            popoverCSS.top = targetTop - popoverHeight;
            nativeEle.className = nativeEle.className + ' popover-bottom';
            originY = 'bottom';
        }
        else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
            popoverEle.style.bottom = POPOVER_MD_BODY_PADDING + 'px';
        }
        popoverEle.style.top = popoverCSS.top + 'px';
        popoverEle.style.left = popoverCSS.left + 'px';
        popoverEle.style[dom_1.CSS.transformOrigin] = originY + ' ' + originX;
        // Since the transition starts before styling is done we
        // want to wait for the styles to apply before showing the wrapper
        popoverWrapperEle.style.opacity = '1';
    };
    PopoverTransition.prototype.iosPositionView = function (nativeEle, ev) {
        var originY = 'top';
        var originX = 'left';
        var popoverWrapperEle = nativeEle.querySelector('.popover-wrapper');
        // Popover content width and height
        var popoverEle = nativeEle.querySelector('.popover-content');
        var popoverDim = popoverEle.getBoundingClientRect();
        var popoverWidth = popoverDim.width;
        var popoverHeight = popoverDim.height;
        // Window body width and height
        var bodyWidth = window.innerWidth;
        var bodyHeight = window.innerHeight;
        // If ev was passed, use that for target element
        var targetDim = ev && ev.target && ev.target.getBoundingClientRect();
        var targetTop = (targetDim && 'top' in targetDim) ? targetDim.top : (bodyHeight / 2) - (popoverHeight / 2);
        var targetLeft = (targetDim && 'left' in targetDim) ? targetDim.left : (bodyWidth / 2);
        var targetWidth = targetDim && targetDim.width || 0;
        var targetHeight = targetDim && targetDim.height || 0;
        // The arrow that shows above the popover on iOS
        var arrowEle = nativeEle.querySelector('.popover-arrow');
        var arrowDim = arrowEle.getBoundingClientRect();
        var arrowWidth = arrowDim.width;
        var arrowHeight = arrowDim.height;
        // If no ev was passed, hide the arrow
        if (!targetDim) {
            arrowEle.style.display = 'none';
        }
        var arrowCSS = {
            top: targetTop + targetHeight,
            left: targetLeft + (targetWidth / 2) - (arrowWidth / 2)
        };
        var popoverCSS = {
            top: targetTop + targetHeight + (arrowHeight - 1),
            left: targetLeft + (targetWidth / 2) - (popoverWidth / 2)
        };
        // If the popover left is less than the padding it is off screen
        // to the left so adjust it, else if the width of the popover
        // exceeds the body width it is off screen to the right so adjust
        if (popoverCSS.left < POPOVER_IOS_BODY_PADDING) {
            popoverCSS.left = POPOVER_IOS_BODY_PADDING;
        }
        else if (popoverWidth + POPOVER_IOS_BODY_PADDING + popoverCSS.left > bodyWidth) {
            popoverCSS.left = bodyWidth - popoverWidth - POPOVER_IOS_BODY_PADDING;
            originX = 'right';
        }
        // If the popover when popped down stretches past bottom of screen,
        // make it pop up if there's room above
        if (targetTop + targetHeight + popoverHeight > bodyHeight && targetTop - popoverHeight > 0) {
            arrowCSS.top = targetTop - (arrowHeight + 1);
            popoverCSS.top = targetTop - popoverHeight - (arrowHeight - 1);
            nativeEle.className = nativeEle.className + ' popover-bottom';
            originY = 'bottom';
        }
        else if (targetTop + targetHeight + popoverHeight > bodyHeight) {
            popoverEle.style.bottom = POPOVER_IOS_BODY_PADDING + '%';
        }
        arrowEle.style.top = arrowCSS.top + 'px';
        arrowEle.style.left = arrowCSS.left + 'px';
        popoverEle.style.top = popoverCSS.top + 'px';
        popoverEle.style.left = popoverCSS.left + 'px';
        popoverEle.style[dom_1.CSS.transformOrigin] = originY + ' ' + originX;
        // Since the transition starts before styling is done we
        // want to wait for the styles to apply before showing the wrapper
        popoverWrapperEle.style.opacity = '1';
    };
    return PopoverTransition;
}(page_transition_1.PageTransition));
var PopoverPopIn = (function (_super) {
    __extends(PopoverPopIn, _super);
    function PopoverPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        this.opts = opts;
        var ele = enteringView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.popover-wrapper'));
        wrapper.fromTo('opacity', 0.01, 1);
        backdrop.fromTo('opacity', 0.01, 0.08);
        this
            .easing('ease')
            .duration(100)
            .add(backdrop)
            .add(wrapper);
    }
    PopoverPopIn.prototype.play = function () {
        var _this = this;
        dom_1.nativeRaf(function () {
            _this.iosPositionView(_this.enteringView.pageRef().nativeElement, _this.opts.ev);
            _super.prototype.play.call(_this);
        });
    };
    return PopoverPopIn;
}(PopoverTransition));
page_transition_1.PageTransition.register('popover-pop-in', PopoverPopIn);
var PopoverPopOut = (function (_super) {
    __extends(PopoverPopOut, _super);
    function PopoverPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        this.opts = opts;
        var ele = leavingView.pageRef().nativeElement;
        var backdrop = new animation_1.Animation(ele.querySelector('ion-backdrop'));
        var wrapper = new animation_1.Animation(ele.querySelector('.popover-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0);
        backdrop.fromTo('opacity', 0.08, 0);
        this
            .easing('ease')
            .duration(500)
            .add(backdrop)
            .add(wrapper);
    }
    return PopoverPopOut;
}(PopoverTransition));
page_transition_1.PageTransition.register('popover-pop-out', PopoverPopOut);
var PopoverMdPopIn = (function (_super) {
    __extends(PopoverMdPopIn, _super);
    function PopoverMdPopIn(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        this.opts = opts;
        var ele = enteringView.pageRef().nativeElement;
        var content = new animation_1.Animation(ele.querySelector('.popover-content'));
        var viewport = new animation_1.Animation(ele.querySelector('.popover-viewport'));
        content.fromTo('scale', 0.001, 1);
        viewport.fromTo('opacity', 0.01, 1);
        this
            .easing('cubic-bezier(0.36,0.66,0.04,1)')
            .duration(300)
            .add(content)
            .add(viewport);
    }
    PopoverMdPopIn.prototype.play = function () {
        var _this = this;
        dom_1.nativeRaf(function () {
            _this.mdPositionView(_this.enteringView.pageRef().nativeElement, _this.opts.ev);
            _super.prototype.play.call(_this);
        });
    };
    return PopoverMdPopIn;
}(PopoverTransition));
page_transition_1.PageTransition.register('popover-md-pop-in', PopoverMdPopIn);
var PopoverMdPopOut = (function (_super) {
    __extends(PopoverMdPopOut, _super);
    function PopoverMdPopOut(enteringView, leavingView, opts) {
        _super.call(this, enteringView, leavingView, opts);
        this.opts = opts;
        var ele = leavingView.pageRef().nativeElement;
        var wrapper = new animation_1.Animation(ele.querySelector('.popover-wrapper'));
        wrapper.fromTo('opacity', 0.99, 0);
        this
            .easing('ease')
            .duration(500)
            .fromTo('opacity', 0.01, 1)
            .add(wrapper);
    }
    return PopoverMdPopOut;
}(PopoverTransition));
page_transition_1.PageTransition.register('popover-md-pop-out', PopoverMdPopOut);
var popoverIds = -1;
var POPOVER_IOS_BODY_PADDING = 2;
var POPOVER_MD_BODY_PADDING = 12;
