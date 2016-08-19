"use strict";
var FeatureDetect = (function () {
    function FeatureDetect() {
        this._results = {};
    }
    FeatureDetect.prototype.run = function (window, document) {
        for (var name_1 in featureDetects) {
            this._results[name_1] = featureDetects[name_1](window, document, document.body);
        }
    };
    FeatureDetect.prototype.has = function (featureName) {
        return !!this._results[featureName];
    };
    FeatureDetect.add = function (name, fn) {
        featureDetects[name] = fn;
    };
    return FeatureDetect;
}());
exports.FeatureDetect = FeatureDetect;
var featureDetects = {};
FeatureDetect.add('hairlines', function (window, document, body) {
    /**
    * Hairline Shim
    * Add the "hairline" CSS class name to the body tag
    * if the browser supports subpixels.
    */
    var canDo = false;
    if (window.devicePixelRatio >= 2) {
        var hairlineEle = document.createElement('div');
        hairlineEle.style.border = '.5px solid transparent';
        body.appendChild(hairlineEle);
        if (hairlineEle.offsetHeight === 1) {
            body.classList.add('hairlines');
            canDo = true;
        }
        body.removeChild(hairlineEle);
    }
    return canDo;
});
FeatureDetect.add('backdrop-filter', function (window, document, body) {
    /**
    * backdrop-filter Shim
    * Checks if css backdrop-filter is implemented by the browser.
    */
    var styles = body.style;
    var backdrop = styles['backdrop-filter'] !== undefined ||
        styles['-webkit-backdrop-filter'] !== undefined;
    if (backdrop) {
        body.classList.add('backdrop-filter');
    }
    return backdrop;
});
