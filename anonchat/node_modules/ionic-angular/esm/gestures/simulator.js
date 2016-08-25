var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Simulate = function () {
    function Simulate() {
        _classCallCheck(this, Simulate);

        this.index = 0;
        this.points = [];
        this.timedelta = 1 / 60;
    }

    _createClass(Simulate, [{
        key: 'reset',
        value: function reset() {
            this.index = 0;
            return this;
        }
    }, {
        key: 'start',
        value: function start(x, y) {
            this.points = [];
            return this.to(x, y);
        }
    }, {
        key: 'to',
        value: function to(x, y) {
            this.newPoint(parseCoordinates(x, y), 1);
            return this;
        }
    }, {
        key: 'delta',
        value: function delta(x, y) {
            var newPoint = parseCoordinates(x, y);
            var prevCoord = this.getLastPoint().coord;
            newPoint.x += prevCoord.x;
            newPoint.y += prevCoord.y;
            this.newPoint(newPoint, 1);
            return this;
        }
    }, {
        key: 'deltaPolar',
        value: function deltaPolar(angle, distance) {
            angle *= Math.PI / 180;
            var prevCoord = this.getLastPoint().coord;
            var coord = {
                x: prevCoord.x + Math.cos(angle) * distance,
                y: prevCoord.y + Math.sin(angle) * distance
            };
            this.newPoint(coord, 1);
            return this;
        }
    }, {
        key: 'toPolar',
        value: function toPolar(angle, distance) {
            angle *= Math.PI / 180;
            var coord = {
                x: Math.cos(angle) * distance,
                y: Math.sin(angle) * distance
            };
            this.newPoint(coord, 1);
            return this;
        }
    }, {
        key: 'duration',
        value: function duration(_duration) {
            this.getLastPoint().duration = _duration;
            return this;
        }
    }, {
        key: 'velocity',
        value: function velocity(vel) {
            var p1 = this.getLastPoint();
            var p2 = this.getPreviousPoint();
            var d = distance(p1, p2);
            return this.duration(d / vel);
        }
    }, {
        key: 'swipeRight',
        value: function swipeRight(maxAngle, distance) {
            // x------>
            var angle = randomAngle(maxAngle);
            return this.deltaPolar(angle, distance);
        }
    }, {
        key: 'swipeLeft',
        value: function swipeLeft(maxAngle, distance) {
            // <------x
            var angle = randomAngle(maxAngle) + 180;
            return this.deltaPolar(angle, distance);
        }
    }, {
        key: 'swipeTop',
        value: function swipeTop(maxAngle, distance) {
            var angle = randomAngle(maxAngle) + 90;
            return this.deltaPolar(angle, distance);
        }
    }, {
        key: 'swipeBottom',
        value: function swipeBottom(maxAngle, distance) {
            var angle = randomAngle(maxAngle) - 90;
            return this.deltaPolar(angle, distance);
        }
    }, {
        key: 'run',
        value: function run(callback) {
            var points = this.points;
            var len = points.length - 1;
            var i = 0;
            for (; i < len; i++) {
                var p1 = points[i].coord;
                var p2 = points[i + 1].coord;
                var duration = points[i + 1].duration;
                var vectorX = p2.x - p1.x;
                var vectorY = p2.y - p1.y;
                var nuSteps = Math.ceil(duration / this.timedelta);
                vectorX /= nuSteps;
                vectorY /= nuSteps;
                for (var j = 0; j < nuSteps; j++) {
                    callback({
                        x: p1.x + vectorX * j,
                        y: p1.y + vectorY * j
                    });
                }
            }
            this.index = i;
            return this;
        }
    }, {
        key: 'newPoint',
        value: function newPoint(coord, duration) {
            this.points.push({
                coord: coord,
                duration: duration
            });
        }
    }, {
        key: 'getLastPoint',
        value: function getLastPoint() {
            var len = this.points.length;
            if (len > 0) {
                return this.points[len - 1];
            }
            throw new Error('can not call point');
        }
    }, {
        key: 'getPreviousPoint',
        value: function getPreviousPoint() {
            var len = this.points.length;
            if (len > 1) {
                return this.points[len - 2];
            }
            throw new Error('can not call point');
        }
    }], [{
        key: 'from',
        value: function from(x, y) {
            var s = new Simulate();
            return s.start(x, y);
        }
    }]);

    return Simulate;
}();

export { Simulate };

function randomAngle(maxAngle) {
    return Math.random() * maxAngle * 2 - maxAngle;
}
function distance(a, b) {
    var deltaX = a.x - b.x;
    var deltaY = a.y - a.y;
    return Math.hypot(deltaX, deltaY);
}
function parseCoordinates(coord, y) {
    if (typeof coord === 'number') {
        return { x: coord, y: y };
    }
    return coord;
}