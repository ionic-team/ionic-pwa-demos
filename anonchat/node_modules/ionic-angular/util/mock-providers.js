"use strict";
var src_1 = require('../../src');
var nav_controller_base_1 = require('../../src/components/nav/nav-controller-base');
exports.mockConfig = function (config) {
    return new src_1.Config(config);
};
exports.mockPlatform = function (platforms) {
    return new src_1.Platform(platforms);
};
exports.mockApp = function (config, platform) {
    config = config || exports.mockConfig();
    platform = platform || exports.mockPlatform();
    return new src_1.App(config, platform);
};
exports.mockZone = function () {
    var zone = {
        run: function (cb) {
            cb();
        },
        runOutsideAngular: function (cb) {
            cb();
        }
    };
    return zone;
};
exports.mockChangeDetectorRef = function () {
    var cd = {
        reattach: function () { },
        detach: function () { }
    };
    return cd;
};
exports.mockElementRef = function () {
    return {
        nativeElement: document.createElement('div')
    };
};
exports.mockRenderer = function () {
    var renderer = {
        setElementAttribute: function () { },
        setElementClass: function () { },
        setElementStyle: function () { }
    };
    return renderer;
};
exports.mockLocation = function () {
    var location = {
        path: function () { return ''; },
        subscribe: function () { },
        go: function () { },
        back: function () { }
    };
    return location;
};
exports.mockTransition = function (playCallback, duration) {
    return function _createTrans(enteringView, leavingView, transitionOpts) {
        var transition = {
            play: function () {
                playCallback();
            },
            getDuration: function () { return duration; },
            onFinish: function () { }
        };
        return transition;
    };
};
exports.mockNavController = function () {
    var platform = exports.mockPlatform();
    var config = exports.mockConfig();
    config.setPlatform(platform);
    var app = exports.mockApp(config, platform);
    var form = new src_1.Form();
    var zone = exports.mockZone();
    var keyboard = new src_1.Keyboard(config, form, zone);
    var elementRef = exports.mockElementRef();
    var renderer = exports.mockRenderer();
    var compiler = null;
    var gestureCtrl = new src_1.GestureController(app);
    var location = exports.mockLocation();
    return new nav_controller_base_1.NavControllerBase(null, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl);
};
exports.mockTab = function (parentTabs) {
    var platform = exports.mockPlatform();
    var config = exports.mockConfig();
    config.setPlatform(platform);
    var app = parentTabs._app || exports.mockApp(config, platform);
    var form = new src_1.Form();
    var zone = exports.mockZone();
    var keyboard = new src_1.Keyboard(config, form, zone);
    var elementRef = exports.mockElementRef();
    var renderer = exports.mockRenderer();
    var changeDetectorRef = exports.mockChangeDetectorRef();
    var compiler = null;
    var gestureCtrl = new src_1.GestureController(app);
    var location = exports.mockLocation();
    var tab = new src_1.Tab(parentTabs, app, config, keyboard, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl);
    tab.load = function (opts, cb) {
        cb();
    };
    return tab;
};
exports.mockTabs = function (app) {
    var config = exports.mockConfig();
    var platform = exports.mockPlatform();
    app = app || exports.mockApp(config, platform);
    var elementRef = exports.mockElementRef();
    var renderer = exports.mockRenderer();
    return new src_1.Tabs(null, null, app, config, elementRef, platform, renderer);
};
