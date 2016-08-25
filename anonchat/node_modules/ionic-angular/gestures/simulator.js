"use strict";
var Simulate = (function () {
    function Simulate() {
        this.index = 0;
        this.points = [];
        this.timedelta = 1 / 60;
    }
    Simulate.from = function (x, y) {
        var s = new Simulate();
        return s.start(x, y);
    };
    Simulate.prototype.reset = function () {
        this.index = 0;
        return this;
    };
    Simulate.prototype.start = function (x, y) {
        this.points = [];
        return this.to(x, y);
    };
    Simulate.prototype.to = function (x, y) {
        this.newPoint(parseCoordinates(x, y), 1);
        return this;
    };
    Simulate.prototype.delta = function (x, y) {
        var newPoint = parseCoordinates(x, y);
        var prevCoord = this.getLastPoint().coord;
        newPoint.x += prevCoord.x;
        newPoint.y += prevCoord.y;
        this.newPoint(newPoint, 1);
        return this;
    };
    Simulate.prototype.deltaPolar = function (angle, distance) {
        angle *= Math.PI / 180;
        var prevCoord = this.getLastPoint().coord;
        var coord = {
            x: prevCoord.x + (Math.cos(angle) * distance),
            y: prevCoord.y + (Math.sin(angle) * distance)
        };
        this.newPoint(coord, 1);
        return this;
    };
    Simulate.prototype.toPolar = function (angle, distance) {
        angle *= Math.PI / 180;
        var coord = {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance
        };
        this.newPoint(coord, 1);
        return this;
    };
    Simulate.prototype.duration = function (duration) {
        this.getLastPoint().duration = duration;
        return this;
    };
    Simulate.prototype.velocity = function (vel) {
        var p1 = this.getLastPoint();
        var p2 = this.getPreviousPoint();
        var d = distance(p1, p2);
        return this.duration(d / vel);
    };
    Simulate.prototype.swipeRight = function (maxAngle, distance) {
        // x------>
        var angle = randomAngle(maxAngle);
        return this.deltaPolar(angle, distance);
    };
    Simulate.prototype.swipeLeft = function (maxAngle, distance) {
        // <------x
        var angle = randomAngle(maxAngle) + 180;
        return this.deltaPolar(angle, distance);
    };
    Simulate.prototype.swipeTop = function (maxAngle, distance) {
        var angle = randomAngle(maxAngle) + 90;
        return this.deltaPolar(angle, distance);
    };
    Simulate.prototype.swipeBottom = function (maxAngle, distance) {
        var angle = randomAngle(maxAngle) - 90;
        return this.deltaPolar(angle, distance);
    };
    Simulate.prototype.run = function (callback) {
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
    };
    Simulate.prototype.newPoint = function (coord, duration) {
        this.points.push({
            coord: coord,
            duration: duration,
        });
    };
    Simulate.prototype.getLastPoint = function () {
        var len = this.points.length;
        if (len > 0) {
            return this.points[len - 1];
        }
        throw new Error('can not call point');
    };
    Simulate.prototype.getPreviousPoint = function () {
        var len = this.points.length;
        if (len > 1) {
            return this.points[len - 2];
        }
        throw new Error('can not call point');
    };
    return Simulate;
}());
exports.Simulate = Simulate;
function randomAngle(maxAngle) {
    return (Math.random() * maxAngle * 2) - maxAngle;
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
