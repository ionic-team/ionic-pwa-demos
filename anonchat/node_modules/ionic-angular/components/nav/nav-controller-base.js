"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var core_1 = require('@angular/core');
var bootstrap_1 = require('../../config/bootstrap');
var ion_1 = require('../ion');
var util_1 = require('../../util/util');
var nav_controller_1 = require('./nav-controller');
var nav_interfaces_1 = require('./nav-interfaces');
var nav_params_1 = require('./nav-params');
var swipe_back_1 = require('./swipe-back');
var transition_1 = require('../../transitions/transition');
var view_controller_1 = require('./view-controller');
/**
 * This class is for internal use only. It is not exported publicly.
 */
var NavControllerBase = (function (_super) {
    __extends(NavControllerBase, _super);
    function NavControllerBase(parent, _app, config, _keyboard, elementRef, _zone, _renderer, _compiler, _gestureCtrl) {
        _super.call(this, elementRef);
        this._app = _app;
        this._keyboard = _keyboard;
        this._zone = _zone;
        this._renderer = _renderer;
        this._compiler = _compiler;
        this._gestureCtrl = _gestureCtrl;
        this._transIds = 0;
        this._init = false;
        this._children = [];
        this._ids = -1;
        this._views = [];
        this.trnsTime = 0;
        this.parent = parent;
        this.config = config;
        this._trnsDelay = config.get('pageTransitionDelay');
        this._sbEnabled = config.getBoolean('swipeBackEnabled');
        this._sbThreshold = config.getNumber('swipeBackThreshold', 40);
        this.id = 'n' + (++ctrlIds);
        this.viewDidLoad = new core_1.EventEmitter();
        this.viewWillEnter = new core_1.EventEmitter();
        this.viewDidEnter = new core_1.EventEmitter();
        this.viewWillLeave = new core_1.EventEmitter();
        this.viewDidLeave = new core_1.EventEmitter();
        this.viewWillUnload = new core_1.EventEmitter();
        this.viewDidUnload = new core_1.EventEmitter();
    }
    NavControllerBase.prototype.setViewport = function (val) {
        this._viewport = val;
    };
    NavControllerBase.prototype.setRoot = function (page, params, opts) {
        return this.setPages([{ page: page, params: params }], opts);
    };
    NavControllerBase.prototype.setPages = function (pages, opts) {
        if (!pages || !pages.length) {
            return Promise.resolve(false);
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // remove existing views
        var leavingView = this._remove(0, this._views.length);
        // create view controllers out of the pages and insert the new views
        var views = pages.map(function (p) { return new view_controller_1.ViewController(p.page, p.params); });
        var enteringView = this._insert(0, views);
        // if animation wasn't set to true then default it to NOT animate
        if (opts.animate !== true) {
            opts.animate = false;
        }
        // set the nav direction to "back" if it wasn't set
        opts.direction = opts.direction || nav_interfaces_1.DIRECTION_BACK;
        var resolve;
        var promise = new Promise(function (res) { resolve = res; });
        // start the transition, fire resolve when done...
        this._transition(enteringView, leavingView, opts, function (hasCompleted) {
            // transition has completed!!
            resolve(hasCompleted);
        });
        return promise;
    };
    NavControllerBase.prototype.push = function (page, params, opts, done) {
        return this.insertPages(-1, [{ page: page, params: params }], opts, done);
    };
    /**
     * DEPRECATED: Please use inject the overlays controller and use the present method on the instance instead.
     */
    NavControllerBase.prototype.present = function (enteringView, opts) {
        // deprecated warning: added beta.11 2016-06-27
        void 0;
        return Promise.resolve();
    };
    NavControllerBase.prototype.insert = function (insertIndex, page, params, opts, done) {
        return this.insertPages(insertIndex, [{ page: page, params: params }], opts, done);
    };
    NavControllerBase.prototype.insertPages = function (insertIndex, insertPages, opts, done) {
        var views = insertPages.map(function (p) { return new view_controller_1.ViewController(p.page, p.params); });
        return this.insertViews(insertIndex, views, opts, done);
    };
    NavControllerBase.prototype.insertViews = function (insertIndex, insertViews, opts, done) {
        if (opts === void 0) { opts = {}; }
        var promise;
        if (!done) {
            // only create a promise if a done callback wasn't provided
            promise = new Promise(function (res) { done = res; });
        }
        if (!insertViews || !insertViews.length) {
            done(false);
            return promise;
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // insert the new page into the stack
        // returns the newly created entering view
        var enteringView = this._insert(insertIndex, insertViews);
        // manually set the new view's id if an id was passed in the options
        if (util_1.isPresent(opts.id)) {
            enteringView.id = opts.id;
        }
        // set the nav direction to "forward" if it wasn't set
        opts.direction = opts.direction || 'forward';
        // set which animation it should use if it wasn't set yet
        if (!opts.animation) {
            opts.animation = enteringView.getTransitionName(opts.direction);
        }
        // it's possible that the newly added view doesn't need to
        // transition in, but was simply inserted somewhere in the stack
        // go backwards through the stack and find the first active view
        // which could be active or one ready to enter
        for (var i = this._views.length - 1; i >= 0; i--) {
            if (this._views[i].state === exports.STATE_ACTIVE || this._views[i].state === exports.STATE_INIT_ENTER) {
                // found the view at the end of the stack that's either
                // already active or it is about to enter
                if (this._views[i] === enteringView) {
                    // cool, so the last valid view is also our entering view!!
                    // this means we should animate that bad boy in so it's the active view
                    // return a promise and resolve when the transition has completed
                    // get the leaving view which the _insert() already set
                    var leavingView = this.getByState(exports.STATE_INIT_LEAVE);
                    if (!leavingView && this._isPortal) {
                        // if we didn't find an active view, and this is a portal
                        var activeNav = this._app.getActiveNav();
                        if (activeNav) {
                            leavingView = activeNav.getByState(exports.STATE_INIT_LEAVE);
                        }
                    }
                    // start the transition, fire resolve when done...
                    this._transition(enteringView, leavingView, opts, done);
                    return promise;
                }
                break;
            }
        }
        // the page was not pushed onto the end of the stack
        // but rather inserted somewhere in the middle or beginning
        // Since there are views after this new one, don't transition in
        // auto resolve cuz there was is no need for an animation
        done(enteringView);
        return promise;
    };
    NavControllerBase.prototype._insert = function (insertIndex, insertViews) {
        // when this is done, there should only be at most
        // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
        // there should not be any that are STATE_ACTIVE after this is done
        var _this = this;
        // allow -1 to be passed in to auto push it on the end
        // and clean up the index if it's larger then the size of the stack
        if (insertIndex < 0 || insertIndex > this._views.length) {
            insertIndex = this._views.length;
        }
        // first see if there's an active view
        var view = this.getActive();
        if (!view && this._isPortal) {
            // if we didn't find an active view, and this is a portal
            var activeNav = this._app.getActiveNav();
            if (activeNav) {
                view = activeNav.getActive();
            }
        }
        if (view) {
            // there's an active view, set that it's initialized to leave
            view.state = exports.STATE_INIT_LEAVE;
        }
        else if (view = this.getByState(exports.STATE_INIT_ENTER)) {
            // oh no, there's already a transition initalized ready to enter!
            // but it actually hasn't entered yet at all so lets
            // just keep it in the array, but not render or animate it in
            view.state = exports.STATE_INACTIVE;
        }
        // insert each of the views in the pages array
        var insertView = null;
        insertViews.forEach(function (view, i) {
            insertView = view;
            // create the new entering view
            view.setNav(_this);
            view.state = exports.STATE_INACTIVE;
            // give this inserted view an ID
            view.id = _this.id + '-' + (++_this._ids);
            // insert the entering view into the correct index in the stack
            _this._views.splice(insertIndex + i, 0, view);
        });
        if (insertView) {
            insertView.state = exports.STATE_INIT_ENTER;
        }
        return insertView;
    };
    NavControllerBase.prototype.pop = function (opts, done) {
        // get the index of the active view
        // which will become the view to be leaving
        var activeView = this.getByState(exports.STATE_TRANS_ENTER) ||
            this.getByState(exports.STATE_INIT_ENTER) ||
            this.getActive();
        return this.remove(this.indexOf(activeView), 1, opts, done);
    };
    NavControllerBase.prototype.popToRoot = function (opts, done) {
        return this.popTo(this.first(), opts, done);
    };
    NavControllerBase.prototype.popTo = function (view, opts, done) {
        var startIndex = this.indexOf(view);
        if (startIndex < 0) {
            return Promise.reject('View not found to pop to');
        }
        var activeView = this.getByState(exports.STATE_TRANS_ENTER) ||
            this.getByState(exports.STATE_INIT_ENTER) ||
            this.getActive();
        var removeCount = this.indexOf(activeView) - startIndex;
        return this.remove(startIndex + 1, removeCount, opts, done);
    };
    NavControllerBase.prototype.remove = function (startIndex, removeCount, opts, done) {
        var _this = this;
        if (startIndex === void 0) { startIndex = -1; }
        if (removeCount === void 0) { removeCount = 1; }
        var promise;
        if (!done) {
            promise = new Promise(function (resolve) { done = resolve; });
        }
        if (startIndex === -1) {
            startIndex = (this._views.length - 1);
        }
        else if (startIndex < 0 || startIndex >= this._views.length) {
            void 0;
            done(false);
            return promise;
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        // if not set, by default climb up the nav controllers if
        // there isn't a previous view in this nav controller
        if (util_1.isBlank(opts.climbNav)) {
            opts.climbNav = true;
        }
        // default the direction to "back"
        opts.direction = opts.direction || nav_interfaces_1.DIRECTION_BACK;
        // figure out the states of each view in the stack
        var leavingView = this._remove(startIndex, removeCount);
        if (!leavingView) {
            var forcedActive = this.getByState(exports.STATE_FORCE_ACTIVE);
            if (forcedActive) {
                // this scenario happens when a remove is going on
                // during a transition
                if (this._trans) {
                    this._trans.stop();
                    this._trans.destroy();
                    this._trans = null;
                    this._cleanup();
                }
                done(false);
                return promise;
            }
        }
        if (leavingView) {
            // there is a view ready to leave, meaning that a transition needs
            // to happen and the previously active view is going to animate out
            // get the view thats ready to enter
            var enteringView = this.getByState(exports.STATE_INIT_ENTER);
            if (!enteringView && this._isPortal) {
                // if we didn't find an active view, and this is a portal
                var activeNav = this._app.getActiveNav();
                if (activeNav) {
                    enteringView = activeNav.last();
                    if (enteringView) {
                        enteringView.state = exports.STATE_INIT_ENTER;
                    }
                }
            }
            if (!enteringView && !this._isPortal) {
                // oh nos! no entering view to go to!
                // if there is no previous view that would enter in this nav stack
                // and the option is set to climb up the nav parent looking
                // for the next nav we could transition to instead
                if (opts.climbNav) {
                    var parentNav = this.parent;
                    while (parentNav) {
                        if (!exports.isTabs(parentNav)) {
                            // Tabs can be a parent, but it is not a collection of views
                            // only we're looking for an actual NavController w/ stack of views
                            leavingView.fireWillLeave();
                            this.viewWillLeave.emit(leavingView);
                            this._app.viewWillLeave.emit(leavingView);
                            return parentNav.pop(opts).then(function (rtnVal) {
                                leavingView.fireDidLeave();
                                _this.viewDidLeave.emit(leavingView);
                                _this._app.viewDidLeave.emit(leavingView);
                                return rtnVal;
                            });
                        }
                        parentNav = parentNav.parent;
                    }
                }
                // there's no previous view and there's no valid parent nav
                // to climb to so this shouldn't actually remove the leaving
                // view because there's nothing that would enter, eww
                leavingView.state = exports.STATE_ACTIVE;
                done(false);
                return promise;
            }
            if (!opts.animation) {
                opts.animation = leavingView.getTransitionName(opts.direction);
            }
            // start the transition, fire resolve when done...
            this._transition(enteringView, leavingView, opts, done);
            return promise;
        }
        // no need to transition when the active view isn't being removed
        // there's still an active view after _remove() figured out states
        // so this means views that were only removed before the active
        // view, so auto-resolve since no transition needs to happen
        done(false);
        return promise;
    };
    /**
     * @private
     */
    NavControllerBase.prototype._remove = function (startIndex, removeCount) {
        var _this = this;
        // when this is done, there should only be at most
        // 1 STATE_INIT_ENTER and 1 STATE_INIT_LEAVE
        // there should not be any that are STATE_ACTIVE after this is done
        var view = null;
        // loop through each view that is set to be removed
        for (var i = startIndex, ii = removeCount + startIndex; i < ii; i++) {
            view = this.getByIndex(i);
            if (!view)
                break;
            if (view.state === exports.STATE_TRANS_ENTER || view.state === exports.STATE_TRANS_LEAVE) {
                // oh no!!! this view should be removed, but it's
                // actively transitioning in at the moment!!
                // since it's viewable right now, let's just set that
                // it should be removed after the transition
                view.state = exports.STATE_REMOVE_AFTER_TRANS;
            }
            else if (view.state === exports.STATE_INIT_ENTER) {
                // asked to be removed before it even entered!
                view.state = exports.STATE_CANCEL_ENTER;
            }
            else {
                // if this view is already leaving then no need to immediately
                // remove it, otherwise set the remove state
                // this is useful if the view being removed isn't going to
                // animate out, but just removed from the stack, no transition
                view.state = exports.STATE_REMOVE;
            }
        }
        if (view = this.getByState(exports.STATE_INIT_LEAVE)) {
            // looks like there's already an active leaving view
            // reassign previous entering view to just be inactive
            var enteringView = this.getByState(exports.STATE_INIT_ENTER);
            if (enteringView) {
                enteringView.state = exports.STATE_INACTIVE;
            }
            // from the index of the leaving view, go backwards and
            // find the first view that is inactive
            for (var i = this.indexOf(view) - 1; i >= 0; i--) {
                if (this._views[i].state === exports.STATE_INACTIVE) {
                    this._views[i].state = exports.STATE_INIT_ENTER;
                    break;
                }
            }
        }
        else if (view = this.getByState(exports.STATE_TRANS_LEAVE)) {
            // an active transition is happening, but a new transition
            // still needs to happen force this view to be the active one
            view.state = exports.STATE_FORCE_ACTIVE;
        }
        else if (view = this.getByState(exports.STATE_REMOVE)) {
            // there is no active transition about to happen
            // find the first view that is supposed to be removed and
            // set that it is the init leaving view
            // the first view to be removed, it should init leave
            view.state = exports.STATE_INIT_LEAVE;
            view.fireWillUnload();
            this.viewWillUnload.emit(view);
            this._app.viewWillUnload.emit(view);
            // from the index of the leaving view, go backwards and
            // find the first view that is inactive so it can be the entering
            for (var i = this.indexOf(view) - 1; i >= 0; i--) {
                if (this._views[i].state === exports.STATE_INACTIVE) {
                    this._views[i].state = exports.STATE_INIT_ENTER;
                    break;
                }
            }
        }
        // if there is still an active view, then it wasn't one that was
        // set to be removed, so there actually won't be a transition at all
        view = this.getActive();
        if (view) {
            // the active view remains untouched, so all the removes
            // must have happened before it, so really no need for transition
            view = this.getByState(exports.STATE_INIT_ENTER);
            if (view) {
                // if it was going to enter, then just make inactive
                view.state = exports.STATE_INACTIVE;
            }
            view = this.getByState(exports.STATE_INIT_LEAVE);
            if (view) {
                // this was going to leave, so just remove it completely
                view.state = exports.STATE_REMOVE;
            }
        }
        // remove views that have been set to be removed, but not
        // apart of any transitions that will eventually happen
        this._views.filter(function (v) { return v.state === exports.STATE_REMOVE; }).forEach(function (view) {
            view.fireWillLeave();
            view.fireDidLeave();
            _this._views.splice(_this.indexOf(view), 1);
            view.destroy();
        });
        return this.getByState(exports.STATE_INIT_LEAVE);
    };
    /**
     * @private
     */
    NavControllerBase.prototype._transition = function (enteringView, leavingView, opts, done) {
        var _this = this;
        var transId = ++this._transIds;
        if (enteringView === leavingView) {
            // if the entering view and leaving view are the same thing don't continue
            this._transFinish(transId, enteringView, leavingView, null, false, false);
            done(false);
            return;
        }
        if (util_1.isBlank(opts)) {
            opts = {};
        }
        this._setAnimate(opts);
        if (!leavingView) {
            // if no leaving view then create a bogus one
            leavingView = new view_controller_1.ViewController();
        }
        if (!enteringView) {
            // if no entering view then create a bogus one
            enteringView = new view_controller_1.ViewController();
            enteringView.fireLoaded();
        }
        /* Async steps to complete a transition
          1. _render: compile the view and render it in the DOM. Load page if it hasn't loaded already. When done call postRender
          2. _postRender: Run willEnter/willLeave, then wait a frame (change detection happens), then call beginTransition
          3. _beforeTrans: Create the transition's animation, play the animation, wait for it to end
          4. _afterTrans: Run didEnter/didLeave, call _transComplete()
          5. _transComplete: Cleanup, remove cache views, then call the final callback
        */
        // begin the multiple async process of transitioning to the entering view
        this._render(transId, enteringView, leavingView, opts, function (hasCompleted) {
            _this._transFinish(transId, enteringView, leavingView, opts.direction, false, hasCompleted);
            done(hasCompleted);
        });
    };
    /**
     * @private
     */
    NavControllerBase.prototype._setAnimate = function (opts) {
        if ((this._views.length === 1 && !this._init && !this._isPortal) || this.config.get('animate') === false) {
            opts.animate = false;
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype._render = function (transId, enteringView, leavingView, opts, done) {
        // compile/load the view into the DOM
        var _this = this;
        if (enteringView.state === exports.STATE_INACTIVE) {
            // this entering view is already set to inactive, so this
            // transition must be canceled, so don't continue
            return done();
        }
        enteringView.state = exports.STATE_INIT_ENTER;
        leavingView.state = exports.STATE_INIT_LEAVE;
        // remember if this nav is already transitioning or not
        var isAlreadyTransitioning = this.isTransitioning();
        if (enteringView.isLoaded()) {
            // already compiled this view, do not load again and continue
            this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
        }
        else {
            // view has not been compiled/loaded yet
            // continue once the view has finished compiling
            // DOM WRITE
            this.setTransitioning(true, 500);
            this.loadPage(enteringView, this._viewport, opts, function () {
                enteringView.fireLoaded();
                _this.viewDidLoad.emit(enteringView);
                _this._app.viewDidLoad.emit(enteringView);
                _this._postRender(transId, enteringView, leavingView, isAlreadyTransitioning, opts, done);
            });
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype._postRender = function (transId, enteringView, leavingView, isAlreadyTransitioning, opts, done) {
        // called after _render has completed and the view is compiled/loaded
        var _this = this;
        if (enteringView.state === exports.STATE_INACTIVE) {
            // this entering view is already set to inactive, so this
            // transition must be canceled, so don't continue
            return done();
        }
        if (!opts.preload) {
            // the enteringView will become the active view, and is not being preloaded
            // set the correct zIndex for the entering and leaving views
            // if there's already another trans_enter happening then
            // the zIndex for the entering view should go off of that one
            // DOM WRITE
            var lastestLeavingView = this.getByState(exports.STATE_TRANS_ENTER) || leavingView;
            this._setZIndex(enteringView, lastestLeavingView, opts.direction);
            // make sure the entering and leaving views are showing
            // DOM WRITE
            if (isAlreadyTransitioning) {
                // the previous transition was still going when this one started
                // so to be safe, only update showing the entering/leaving
                // don't hide the others when they could still be transitioning
                enteringView.domShow(true, this._renderer);
                leavingView.domShow(true, this._renderer);
            }
            else {
                // there are no other transitions happening but this one
                // only entering/leaving should show, all others hidden
                // also if a view is an overlay or the previous view is an
                // overlay then always show the overlay and the view before it
                this._views.forEach(function (view) {
                    view.domShow(_this._isPortal || (view === enteringView) || (view === leavingView), _this._renderer);
                });
            }
            // call each view's lifecycle events
            if (leavingView.fireOtherLifecycles) {
                // only fire entering lifecycle if the leaving
                // view hasn't explicitly set not to
                enteringView.fireWillEnter();
                this.viewWillEnter.emit(enteringView);
                this._app.viewWillEnter.emit(enteringView);
            }
            if (enteringView.fireOtherLifecycles) {
                // only fire leaving lifecycle if the entering
                // view hasn't explicitly set not to
                leavingView.fireWillLeave();
                this.viewWillLeave.emit(leavingView);
                this._app.viewWillLeave.emit(leavingView);
            }
        }
        else {
            // this view is being preloaded, don't call lifecycle events
            // transition does not need to animate
            opts.animate = false;
        }
        this._beforeTrans(enteringView, leavingView, opts, done);
    };
    /**
     * @private
     */
    NavControllerBase.prototype._beforeTrans = function (enteringView, leavingView, opts, done) {
        // called after one raf from postRender()
        // create the transitions animation, play the animation
        // when the transition ends call wait for it to end
        var _this = this;
        if (enteringView.state === exports.STATE_INACTIVE || enteringView.state === exports.STATE_CANCEL_ENTER) {
            // this entering view is already set to inactive or has been canceled
            // so this transition must not begin, so don't continue
            return done();
        }
        enteringView.state = exports.STATE_TRANS_ENTER;
        leavingView.state = exports.STATE_TRANS_LEAVE;
        // everything during the transition should runOutsideAngular
        this._zone.runOutsideAngular(function () {
            // init the transition animation
            var transitionOpts = {
                animation: opts.animation,
                direction: opts.direction,
                duration: opts.duration,
                easing: opts.easing,
                renderDelay: opts.transitionDelay || _this._trnsDelay,
                isRTL: _this.config.platform.isRTL(),
                ev: opts.ev,
            };
            var transAnimation = _this._createTrans(enteringView, leavingView, transitionOpts);
            _this._trans && _this._trans.destroy();
            _this._trans = transAnimation;
            if (opts.animate === false) {
                // force it to not animate the elements, just apply the "to" styles
                transAnimation.duration(0);
            }
            // check if a parent is transitioning and get the time that it ends
            var parentTransitionEndTime = _this.getLongestTrans(Date.now());
            if (parentTransitionEndTime > 0) {
                // the parent is already transitioning and has disabled the app
                // so just update the local transitioning information
                var duration = parentTransitionEndTime - Date.now();
                _this.setTransitioning(true, duration);
            }
            else {
                // this is the only active transition (for now), so disable the app
                var keyboardDurationPadding = 0;
                if (_this._keyboard.isOpen()) {
                    // add XXms to the duration the app is disabled when the keyboard is open
                    keyboardDurationPadding = 600;
                }
                var duration = transAnimation.getDuration() + keyboardDurationPadding;
                var enableApp = (duration < 64);
                _this._app.setEnabled(enableApp, duration);
                _this.setTransitioning(!enableApp, duration);
            }
            // create a callback for when the animation is done
            transAnimation.onFinish(function (trans) {
                // transition animation has ended
                // destroy the animation and it's element references
                trans.destroy();
                _this._afterTrans(enteringView, leavingView, opts, trans.hasCompleted, done);
            });
            // cool, let's do this, start the transition
            if (opts.progressAnimation) {
                // this is a swipe to go back, just get the transition progress ready
                // kick off the swipe animation start
                transAnimation.progressStart();
            }
            else {
                // this is a normal animation
                // kick it off and let it play through
                transAnimation.play();
            }
        });
    };
    /**
     * @private
     */
    NavControllerBase.prototype._afterTrans = function (enteringView, leavingView, opts, hasCompleted, done) {
        // transition has completed, update each view's state
        // place back into the zone, run didEnter/didLeave
        // call the final callback when done
        var _this = this;
        // run inside of the zone again
        this._zone.run(function () {
            if (!opts.preload && hasCompleted) {
                if (leavingView.fireOtherLifecycles) {
                    // only fire entering lifecycle if the leaving
                    // view hasn't explicitly set not to
                    enteringView.fireDidEnter();
                    _this.viewDidEnter.emit(enteringView);
                    _this._app.viewDidEnter.emit(enteringView);
                }
                if (enteringView.fireOtherLifecycles && _this._init) {
                    // only fire leaving lifecycle if the entering
                    // view hasn't explicitly set not to
                    // and after the nav has initialized
                    leavingView.fireDidLeave();
                    _this.viewDidLeave.emit(leavingView);
                    _this._app.viewDidLeave.emit(leavingView);
                }
            }
            if (enteringView.state === exports.STATE_INACTIVE) {
                // this entering view is already set to inactive, so this
                // transition must be canceled, so don't continue
                return done(hasCompleted);
            }
            if (opts.keyboardClose !== false && _this._keyboard.isOpen()) {
                // the keyboard is still open!
                // no problem, let's just close for them
                _this._keyboard.close();
                _this._keyboard.onClose(function () {
                    // keyboard has finished closing, transition complete
                    done(hasCompleted);
                }, 32);
            }
            else {
                // all good, transition complete
                done(hasCompleted);
            }
        });
    };
    /**
     * @private
     */
    NavControllerBase.prototype._transFinish = function (transId, enteringView, leavingView, direction, updateUrl, hasCompleted) {
        // a transition has completed, but not sure if it's the last one or not
        // check if this transition is the most recent one or not
        var _this = this;
        if (enteringView.state === exports.STATE_CANCEL_ENTER) {
            // this view was told to leave before it finished entering
            this.remove(enteringView.index, 1);
        }
        if (transId === this._transIds) {
            // ok, good news, there were no other transitions that kicked
            // off during the time this transition started and ended
            if (hasCompleted) {
                // this transition has completed as normal
                // so the entering one is now the active view
                // and the leaving view is now just inactive
                if (enteringView.state !== exports.STATE_REMOVE_AFTER_TRANS) {
                    enteringView.state = exports.STATE_ACTIVE;
                }
                if (leavingView.state !== exports.STATE_REMOVE_AFTER_TRANS) {
                    leavingView.state = exports.STATE_INACTIVE;
                }
                // only need to do all this clean up if the transition
                // completed, otherwise nothing actually changed
                // destroy all of the views that come after the active view
                this._cleanup();
                // make sure only this entering view and PREVIOUS view are the
                // only two views that are not display:none
                // do not make any changes to the stack's current visibility
                // if there is an overlay somewhere in the stack
                leavingView = this.getPrevious(enteringView);
                if (this._isPortal) {
                    // ensure the entering view is showing
                    enteringView.domShow(true, this._renderer);
                }
                else {
                    // only possibly hide a view if there are no overlays in the stack
                    this._views.forEach(function (view) {
                        view.domShow((view === enteringView) || (view === leavingView), _this._renderer);
                    });
                }
                // this check only needs to happen once, which will add the css
                // class to the nav when it's finished its first transition
                this._init = true;
            }
            else {
                // this transition has not completed, meaning the
                // entering view did not end up as the active view
                // this would happen when swipe to go back started
                // but the user did not complete the swipe and the
                // what was the active view stayed as the active view
                leavingView.state = exports.STATE_ACTIVE;
                enteringView.state = exports.STATE_INACTIVE;
            }
            // check if there is a parent actively transitioning
            var transitionEndTime = this.getLongestTrans(Date.now());
            // if transitionEndTime is greater than 0, there is a parent transition occurring
            // so delegate enabling the app to the parent.  If it <= 0, go ahead and enable the app
            if (transitionEndTime <= 0) {
                this._app && this._app.setEnabled(true);
            }
            // update that this nav is not longer actively transitioning
            this.setTransitioning(false);
            // see if we should add the swipe back gesture listeners or not
            this._sbCheck();
        }
        else {
            // darn, so this wasn't the most recent transition
            // so while this one did end, there's another more recent one
            // still going on. Because a new transition is happening,
            // then this entering view isn't actually going to be the active
            // one, so only update the state to active/inactive if the state
            // wasn't already updated somewhere else during its transition
            if (enteringView.state === exports.STATE_TRANS_ENTER) {
                enteringView.state = exports.STATE_INACTIVE;
            }
            if (leavingView.state === exports.STATE_TRANS_LEAVE) {
                leavingView.state = exports.STATE_INACTIVE;
            }
        }
    };
    /**
     *@private
     * This method is just a wrapper to the Transition function of same name
     * to make it easy/possible to mock the method call by overriding the function.
     * In testing we don't want to actually do the animation, we want to return a stub instead
     */
    NavControllerBase.prototype._createTrans = function (enteringView, leavingView, transitionOpts) {
        return transition_1.Transition.createTransition(enteringView, leavingView, transitionOpts);
    };
    NavControllerBase.prototype._cleanup = function () {
        var _this = this;
        // ok, cleanup time!! Destroy all of the views that are
        // INACTIVE and come after the active view
        var activeViewIndex = this.indexOf(this.getActive());
        var destroys = this._views.filter(function (v) { return v.state === exports.STATE_REMOVE_AFTER_TRANS; });
        for (var i = activeViewIndex + 1; i < this._views.length; i++) {
            if (this._views[i].state === exports.STATE_INACTIVE) {
                destroys.push(this._views[i]);
            }
        }
        // all pages being destroyed should be removed from the list of
        // pages and completely removed from the dom
        destroys.forEach(function (view) {
            _this._views.splice(_this.indexOf(view), 1);
            view.destroy();
            _this.viewDidUnload.emit(view);
            _this._app.viewDidUnload.emit(view);
        });
        // if any z-index goes under 0, then reset them all
        var shouldResetZIndex = this._views.some(function (v) { return v.zIndex < 0; });
        if (shouldResetZIndex) {
            this._views.forEach(function (view) {
                view.setZIndex(view.zIndex + INIT_ZINDEX + 1, _this._renderer);
            });
        }
    };
    NavControllerBase.prototype.getActiveChildNav = function () {
        return this._children[this._children.length - 1];
    };
    /**
     * @private
     */
    NavControllerBase.prototype.registerChildNav = function (nav) {
        this._children.push(nav);
    };
    /**
     * @private
     */
    NavControllerBase.prototype.unregisterChildNav = function (nav) {
        var index = this._children.indexOf(nav);
        if (index > -1) {
            this._children.splice(index, 1);
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype.ngOnDestroy = function () {
        for (var i = this._views.length - 1; i >= 0; i--) {
            this._views[i].destroy();
        }
        this._views.length = 0;
        if (this.parent && this.parent.unregisterChildNav) {
            this.parent.unregisterChildNav(this);
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype.loadPage = function (view, viewport, opts, done) {
        var _this = this;
        if (!viewport || !view.componentType) {
            return;
        }
        // TEMPORARY: automatically set selector w/ dah reflector
        // TODO: use componentFactory.create once fixed
        bootstrap_1.addSelector(view.componentType, 'ion-page');
        this._compiler.resolveComponent(view.componentType).then(function (componentFactory) {
            if (view.state === exports.STATE_CANCEL_ENTER) {
                // view may have already been removed from the stack
                // if so, don't even bother adding it
                view.destroy();
                _this._views.splice(view.index, 1);
                return;
            }
            // add more providers to just this page
            var componentProviders = core_1.ReflectiveInjector.resolve([
                core_1.provide(nav_controller_1.NavController, { useValue: _this }),
                core_1.provide(view_controller_1.ViewController, { useValue: view }),
                core_1.provide(nav_params_1.NavParams, { useValue: view.getNavParams() })
            ]);
            var childInjector = core_1.ReflectiveInjector.fromResolvedProviders(componentProviders, _this._viewport.parentInjector);
            var componentRef = componentFactory.create(childInjector, null, null);
            viewport.insert(componentRef.hostView, viewport.length);
            // a new ComponentRef has been created
            // set the ComponentRef's instance to its ViewController
            view.setInstance(componentRef.instance);
            // the component has been loaded, so call the view controller's loaded method to load any dependencies into the dom
            view.loaded(function () {
                // the ElementRef of the actual ion-page created
                var pageElementRef = componentRef.location;
                // remember the ChangeDetectorRef for this ViewController
                view.setChangeDetector(componentRef.changeDetectorRef);
                // remember the ElementRef to the ion-page elementRef that was just created
                view.setPageRef(pageElementRef);
                // auto-add page css className created from component JS class name
                var cssClassName = util_1.pascalCaseToDashCase(view.componentType.name);
                _this._renderer.setElementClass(pageElementRef.nativeElement, cssClassName, true);
                view.onDestroy(function () {
                    // ensure the element is cleaned up for when the view pool reuses this element
                    _this._renderer.setElementAttribute(pageElementRef.nativeElement, 'class', null);
                    _this._renderer.setElementAttribute(pageElementRef.nativeElement, 'style', null);
                    componentRef.destroy();
                });
                // our job is done here
                done(view);
            });
        });
    };
    /**
     * @private
     */
    NavControllerBase.prototype.swipeBackStart = function () {
        // default the direction to "back"
        var opts = {
            direction: nav_interfaces_1.DIRECTION_BACK,
            progressAnimation: true
        };
        // figure out the states of each view in the stack
        var leavingView = this._remove(this._views.length - 1, 1);
        if (leavingView) {
            opts.animation = leavingView.getTransitionName(opts.direction);
            // get the view thats ready to enter
            var enteringView = this.getByState(exports.STATE_INIT_ENTER);
            // start the transition, fire callback when done...
            this._transition(enteringView, leavingView, opts, function (hasCompleted) {
                // swipe back has finished!!
                void 0;
            });
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype.swipeBackProgress = function (stepValue) {
        if (this._trans && this._sbGesture) {
            // continue to disable the app while actively dragging
            this._app.setEnabled(false, 4000);
            this.setTransitioning(true, 4000);
            // set the transition animation's progress
            this._trans.progressStep(stepValue);
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype.swipeBackEnd = function (shouldComplete, currentStepValue) {
        if (this._trans && this._sbGesture) {
            // the swipe back gesture has ended
            this._trans.progressEnd(shouldComplete, currentStepValue);
        }
    };
    /**
     * @private
     */
    NavControllerBase.prototype._sbCheck = function () {
        var _this = this;
        if (this._sbEnabled) {
            // this nav controller can have swipe to go back
            if (!this._sbGesture) {
                // create the swipe back gesture if we haven't already
                var opts = {
                    edge: 'left',
                    threshold: this._sbThreshold
                };
                this._sbGesture = new swipe_back_1.SwipeBackGesture(this.getNativeElement(), opts, this, this._gestureCtrl);
            }
            if (this.canSwipeBack()) {
                // it is be possible to swipe back
                if (!this._sbGesture.isListening) {
                    this._zone.runOutsideAngular(function () {
                        // start listening if it's not already
                        void 0;
                        _this._sbGesture.listen();
                    });
                }
            }
            else if (this._sbGesture.isListening) {
                // it should not be possible to swipe back
                // but the gesture is still listening
                void 0;
                this._sbGesture.unlisten();
            }
        }
    };
    NavControllerBase.prototype.canSwipeBack = function () {
        return (this._sbEnabled && !this.isTransitioning() && this._app.isEnabled() && this.canGoBack());
    };
    NavControllerBase.prototype.canGoBack = function () {
        var activeView = this.getActive();
        if (activeView) {
            return activeView.enableBack();
        }
        return false;
    };
    NavControllerBase.prototype.isTransitioning = function (includeAncestors) {
        var now = Date.now();
        if (includeAncestors && this.getLongestTrans(now) > 0) {
            return true;
        }
        return (this.trnsTime > now);
    };
    NavControllerBase.prototype.setTransitioning = function (isTransitioning, fallback) {
        if (fallback === void 0) { fallback = 700; }
        this.trnsTime = (isTransitioning ? Date.now() + fallback : 0);
    };
    NavControllerBase.prototype.getLongestTrans = function (now) {
        // traverses parents upwards and looks at the time the
        // transition ends (if it's transitioning) and returns the
        // value that is the furthest into the future thus giving us
        // the longest transition duration
        var parentNav = this.parent;
        var transitionEndTime = -1;
        while (parentNav) {
            if (parentNav.trnsTime > transitionEndTime) {
                transitionEndTime = parentNav.trnsTime;
            }
            parentNav = parentNav.parent;
        }
        // only check if the transitionTime is greater than the current time once
        return transitionEndTime > 0 && transitionEndTime > now ? transitionEndTime : 0;
    };
    NavControllerBase.prototype.getByState = function (state) {
        for (var i = this._views.length - 1; i >= 0; i--) {
            if (this._views[i].state === state) {
                return this._views[i];
            }
        }
        return null;
    };
    NavControllerBase.prototype.getByIndex = function (index) {
        return (index < this._views.length && index > -1 ? this._views[index] : null);
    };
    NavControllerBase.prototype.getActive = function () {
        return this.getByState(exports.STATE_ACTIVE);
    };
    NavControllerBase.prototype.isActive = function (view) {
        // returns if the given view is the active view or not
        return !!(view && view.state === exports.STATE_ACTIVE);
    };
    NavControllerBase.prototype.getPrevious = function (view) {
        // returns the view controller which is before the given view controller.
        return this.getByIndex(this.indexOf(view) - 1);
    };
    NavControllerBase.prototype.first = function () {
        // returns the first view controller in this nav controller's stack.
        return (this._views.length ? this._views[0] : null);
    };
    NavControllerBase.prototype.last = function () {
        // returns the last page in this nav controller's stack.
        return (this._views.length ? this._views[this._views.length - 1] : null);
    };
    NavControllerBase.prototype.indexOf = function (view) {
        // returns the index number of the given view controller.
        return this._views.indexOf(view);
    };
    NavControllerBase.prototype.length = function () {
        return this._views.length;
    };
    NavControllerBase.prototype.isSwipeBackEnabled = function () {
        return this._sbEnabled;
    };
    Object.defineProperty(NavControllerBase.prototype, "rootNav", {
        /**
         * DEPRECATED: Please use app.getRootNav() instead
         */
        get: function () {
            // deprecated 07-14-2016 beta.11
            void 0;
            return this._app.getRootNav();
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     * Dismiss all pages which have set the `dismissOnPageChange` property.
     */
    NavControllerBase.prototype.dismissPageChangeViews = function () {
        this._views.forEach(function (view) {
            if (view.data && view.data.dismissOnPageChange) {
                view.dismiss();
            }
        });
    };
    /**
     * @private
     */
    NavControllerBase.prototype._setZIndex = function (enteringView, leavingView, direction) {
        if (enteringView) {
            // get the leaving view, which could be in various states
            if (!leavingView || !leavingView.isLoaded()) {
                // the leavingView is a mocked view, either we're
                // actively transitioning or it's the initial load
                var previousView = this.getPrevious(enteringView);
                if (previousView && previousView.isLoaded()) {
                    // we found a better previous view to reference
                    // use this one instead
                    enteringView.setZIndex(previousView.zIndex + 1, this._renderer);
                }
                else {
                    // this is the initial view
                    enteringView.setZIndex(this._isPortal ? PORTAL_ZINDEX : INIT_ZINDEX, this._renderer);
                }
            }
            else if (direction === nav_interfaces_1.DIRECTION_BACK) {
                // moving back
                enteringView.setZIndex(leavingView.zIndex - 1, this._renderer);
            }
            else {
                // moving forward
                enteringView.setZIndex(leavingView.zIndex + 1, this._renderer);
            }
        }
    };
    return NavControllerBase;
}(ion_1.Ion));
exports.NavControllerBase = NavControllerBase;
exports.isTabs = function (nav) {
    // Tabs (ion-tabs)
    return !!nav.getSelected;
};
exports.isTab = function (nav) {
    // Tab (ion-tab)
    return util_1.isPresent(nav._tabId);
};
exports.isNav = function (nav) {
    // Nav (ion-nav), Tab (ion-tab), Portal (ion-portal)
    return util_1.isPresent(nav.push);
};
exports.STATE_ACTIVE = 1;
exports.STATE_INACTIVE = 2;
exports.STATE_INIT_ENTER = 3;
exports.STATE_INIT_LEAVE = 4;
exports.STATE_TRANS_ENTER = 5;
exports.STATE_TRANS_LEAVE = 6;
exports.STATE_REMOVE = 7;
exports.STATE_REMOVE_AFTER_TRANS = 8;
exports.STATE_CANCEL_ENTER = 9;
exports.STATE_FORCE_ACTIVE = 10;
var INIT_ZINDEX = 100;
var PORTAL_ZINDEX = 9999;
var ctrlIds = -1;
