import { App, Config, Form, GestureController, Keyboard, Platform, Tab, Tabs } from '../../src';
import { NavControllerBase } from '../../src/components/nav/nav-controller-base';
export var mockConfig = function mockConfig(config) {
    return new Config(config);
};
export var mockPlatform = function mockPlatform(platforms) {
    return new Platform(platforms);
};
export var mockApp = function mockApp(config, platform) {
    config = config || mockConfig();
    platform = platform || mockPlatform();
    return new App(config, platform);
};
export var mockZone = function mockZone() {
    var zone = {
        run: function run(cb) {
            cb();
        },
        runOutsideAngular: function runOutsideAngular(cb) {
            cb();
        }
    };
    return zone;
};
export var mockChangeDetectorRef = function mockChangeDetectorRef() {
    var cd = {
        reattach: function reattach() {},
        detach: function detach() {}
    };
    return cd;
};
export var mockElementRef = function mockElementRef() {
    return {
        nativeElement: document.createElement('div')
    };
};
export var mockRenderer = function mockRenderer() {
    var renderer = {
        setElementAttribute: function setElementAttribute() {},
        setElementClass: function setElementClass() {},
        setElementStyle: function setElementStyle() {}
    };
    return renderer;
};
export var mockLocation = function mockLocation() {
    var location = {
        path: function path() {
            return '';
        },
        subscribe: function subscribe() {},
        go: function go() {},
        back: function back() {}
    };
    return location;
};
export var mockTransition = function mockTransition(playCallback, duration) {
    return function _createTrans(enteringView, leavingView, transitionOpts) {
        var transition = {
            play: function play() {
                playCallback();
            },
            getDuration: function getDuration() {
                return duration;
            },
            onFinish: function onFinish() {}
        };
        return transition;
    };
};
export var mockNavController = function mockNavController() {
    var platform = mockPlatform();
    var config = mockConfig();
    config.setPlatform(platform);
    var app = mockApp(config, platform);
    var form = new Form();
    var zone = mockZone();
    var keyboard = new Keyboard(config, form, zone);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var compiler = null;
    var gestureCtrl = new GestureController(app);
    var location = mockLocation();
    return new NavControllerBase(null, app, config, keyboard, elementRef, zone, renderer, compiler, gestureCtrl);
};
export var mockTab = function mockTab(parentTabs) {
    var platform = mockPlatform();
    var config = mockConfig();
    config.setPlatform(platform);
    var app = parentTabs._app || mockApp(config, platform);
    var form = new Form();
    var zone = mockZone();
    var keyboard = new Keyboard(config, form, zone);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    var changeDetectorRef = mockChangeDetectorRef();
    var compiler = null;
    var gestureCtrl = new GestureController(app);
    var location = mockLocation();
    var tab = new Tab(parentTabs, app, config, keyboard, elementRef, zone, renderer, compiler, changeDetectorRef, gestureCtrl);
    tab.load = function (opts, cb) {
        cb();
    };
    return tab;
};
export var mockTabs = function mockTabs(app) {
    var config = mockConfig();
    var platform = mockPlatform();
    app = app || mockApp(config, platform);
    var elementRef = mockElementRef();
    var renderer = mockRenderer();
    return new Tabs(null, null, app, config, elementRef, platform, renderer);
};