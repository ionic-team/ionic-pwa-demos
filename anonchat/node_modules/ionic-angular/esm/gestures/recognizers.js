var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

export var PanRecognizer = function () {
    function PanRecognizer(direction, threshold, maxAngle) {
        _classCallCheck(this, PanRecognizer);

        this.direction = direction;
        this.dirty = false;
        this._angle = 0;
        this._isPan = 0;
        var radians = maxAngle * (Math.PI / 180);
        this.maxCosine = Math.cos(radians);
        this.threshold = threshold * threshold;
    }

    _createClass(PanRecognizer, [{
        key: 'start',
        value: function start(coord) {
            this.startCoord = coord;
            this._angle = 0;
            this._isPan = 0;
            this.dirty = true;
        }
    }, {
        key: 'detect',
        value: function detect(coord) {
            if (!this.dirty) {
                return false;
            }
            var deltaX = coord.x - this.startCoord.x;
            var deltaY = coord.y - this.startCoord.y;
            var distance = deltaX * deltaX + deltaY * deltaY;
            if (distance >= this.threshold) {
                var angle = Math.atan2(deltaY, deltaX);
                var cosine = this.direction === 'y' ? Math.sin(angle) : Math.cos(angle);
                this._angle = angle;
                if (cosine > this.maxCosine) {
                    this._isPan = 1;
                } else if (cosine < -this.maxCosine) {
                    this._isPan = -1;
                } else {
                    this._isPan = 0;
                }
                this.dirty = false;
                return true;
            }
            return false;
        }
    }, {
        key: 'angle',
        value: function angle() {
            return this._angle;
        }
    }, {
        key: 'pan',
        value: function pan() {
            return this._isPan;
        }
    }]);

    return PanRecognizer;
}();