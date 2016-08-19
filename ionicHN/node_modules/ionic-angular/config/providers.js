"use strict";
var core_1 = require('@angular/core');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var action_sheet_1 = require('../components/action-sheet/action-sheet');
var alert_1 = require('../components/alert/alert');
var app_1 = require('../components/app/app');
var config_1 = require('./config');
var dom_1 = require('../util/dom');
var events_1 = require('../util/events');
var feature_detect_1 = require('../util/feature-detect');
var form_1 = require('../util/form');
var gesture_controller_1 = require('../gestures/gesture-controller');
var directives_1 = require('./directives');
var util_1 = require('../util/util');
var keyboard_1 = require('../util/keyboard');
var loading_1 = require('../components/loading/loading');
var menu_controller_1 = require('../components/menu/menu-controller');
var modal_1 = require('../components/modal/modal');
var picker_1 = require('../components/picker/picker');
var platform_1 = require('../platform/platform');
var popover_1 = require('../components/popover/popover');
var scroll_view_1 = require('../util/scroll-view');
var tap_click_1 = require('../components/tap-click/tap-click');
var toast_1 = require('../components/toast/toast');
var translate_1 = require('../translation/translate');
/**
 * @private
 */
function ionicProviders(customProviders, config) {
    // create an instance of Config
    if (!(config instanceof config_1.Config)) {
        config = new config_1.Config(config);
    }
    // enable production mode if config set to true
    if (config.getBoolean('prodMode')) {
        core_1.enableProdMode();
    }
    // create an instance of Platform
    var platform = new platform_1.Platform();
    // initialize platform
    platform.setUrl(window.location.href);
    platform.setUserAgent(window.navigator.userAgent);
    platform.setNavigatorPlatform(window.navigator.platform);
    platform.load();
    config.setPlatform(platform);
    var events = new events_1.Events();
    var featureDetect = new feature_detect_1.FeatureDetect();
    setupDom(window, document, config, platform, featureDetect);
    bindEvents(window, document, platform, events);
    var providers = [
        action_sheet_1.ActionSheetController,
        alert_1.AlertController,
        app_1.App,
        core_1.provide(config_1.Config, { useValue: config }),
        forms_1.disableDeprecatedForms(),
        core_1.provide(events_1.Events, { useValue: events }),
        core_1.provide(feature_detect_1.FeatureDetect, { useValue: featureDetect }),
        form_1.Form,
        gesture_controller_1.GestureController,
        http_1.HTTP_PROVIDERS,
        keyboard_1.Keyboard,
        loading_1.LoadingController,
        menu_controller_1.MenuController,
        modal_1.ModalController,
        picker_1.PickerController,
        popover_1.PopoverController,
        core_1.provide(platform_1.Platform, { useValue: platform }),
        core_1.provide(core_1.PLATFORM_DIRECTIVES, { useValue: directives_1.IONIC_DIRECTIVES, multi: true }),
        forms_1.provideForms(),
        tap_click_1.TapClick,
        toast_1.ToastController,
        translate_1.Translate,
    ];
    if (util_1.isPresent(customProviders)) {
        providers.push(customProviders);
    }
    return providers;
}
exports.ionicProviders = ionicProviders;
function setupDom(window, document, config, platform, featureDetect) {
    var bodyEle = document.body;
    var mode = config.get('mode');
    // if dynamic mode links have been added the fire up the correct one
    var modeLinkAttr = mode + '-href';
    var linkEle = document.head.querySelector('link[' + modeLinkAttr + ']');
    if (linkEle) {
        var href = linkEle.getAttribute(modeLinkAttr);
        linkEle.removeAttribute(modeLinkAttr);
        linkEle.href = href;
    }
    // set the mode class name
    // ios/md/wp
    bodyEle.classList.add(mode);
    // language and direction
    platform.setDir(document.documentElement.dir, false);
    platform.setLang(document.documentElement.lang, false);
    var versions = platform.versions();
    platform.platforms().forEach(function (platformName) {
        // platform-ios
        var platformClass = 'platform-' + platformName;
        bodyEle.classList.add(platformClass);
        var platformVersion = versions[platformName];
        if (platformVersion) {
            // platform-ios9
            platformClass += platformVersion.major;
            bodyEle.classList.add(platformClass);
            // platform-ios9_3
            bodyEle.classList.add(platformClass + '_' + platformVersion.minor);
        }
    });
    // touch devices should not use :hover CSS pseudo
    // enable :hover CSS when the "hoverCSS" setting is not false
    if (config.getBoolean('hoverCSS', true)) {
        bodyEle.classList.add('enable-hover');
    }
    // run feature detection tests
    featureDetect.run(window, document);
}
/**
 * Bind some global events and publish on the 'app' channel
 */
function bindEvents(window, document, platform, events) {
    window.addEventListener('online', function (ev) {
        events.publish('app:online', ev);
    }, false);
    window.addEventListener('offline', function (ev) {
        events.publish('app:offline', ev);
    }, false);
    window.addEventListener('orientationchange', function (ev) {
        events.publish('app:rotated', ev);
    });
    // When that status taps, we respond
    window.addEventListener('statusTap', function (ev) {
        // TODO: Make this more better
        var el = document.elementFromPoint(platform.width() / 2, platform.height() / 2);
        if (!el) {
            return;
        }
        var content = dom_1.closest(el, 'scroll-content');
        if (content) {
            var scroll = new scroll_view_1.ScrollView(content);
            scroll.scrollTo(0, 0, 300);
        }
    });
    // start listening for resizes XXms after the app starts
    dom_1.nativeTimeout(function () {
        window.addEventListener('resize', function () {
            platform.windowResize();
        });
    }, 2000);
}
