var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

export var FeatureDetect = function () {
    function FeatureDetect() {
        _classCallCheck(this, FeatureDetect);

        this._results = {};
    }

    _createClass(FeatureDetect, [{
        key: 'run',
        value: function run(window, document) {
            for (var name in featureDetects) {
                this._results[name] = featureDetects[name](window, document, document.body);
            }
        }
    }, {
        key: 'has',
        value: function has(featureName) {
            return !!this._results[featureName];
        }
    }], [{
        key: 'add',
        value: function add(name, fn) {
            featureDetects[name] = fn;
        }
    }]);

    return FeatureDetect;
}();
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
    var backdrop = styles['backdrop-filter'] !== undefined || styles['-webkit-backdrop-filter'] !== undefined;
    if (backdrop) {
        body.classList.add('backdrop-filter');
    }
    return backdrop;
});