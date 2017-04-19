class Utils {
    static rand(max) {
        return Math.floor(Math.random() * max);
    }
    static serializePlayerArray(arr) {
        var serialData = [];
        for (var i = 0; i < arr.length; ++i) {
            serialData = serialData.concat(arr[i].player.getUpdateData());
        }
        return serialData;
    }
    static coordInBounds(c, bounds) {
        return (c <= (bounds) && c >= 0);
    }
    static coordsIn(x, y, x2, y2, bounds) {
        var rx1 = x2 - bounds;
        var rx2 = x2 + bounds;
        var ry1 = y2 - bounds;
        var ry2 = y2 + bounds;

        return ((rx1 <= x  && x <= rx2) &&
				     (ry1 <= y  && y <= ry2));
    }
    static isInSnow(player) {
        return (player.player.y <= gameServer.config.snowStart - 5);
    }
    static coordIsWithin(c, t, radius) {
        var c1 = t - radius;
        var c2 = t + radius;
        return ((c1 <= c) && (c <= c2));
    }
    static checkCollide(x1, y1, x2, y2, width) {
        var r = {
            x1: x2 - width,
            y1: y2 - width,
            x2: x2 + width,
            y2: y2 + width
        }
        return {
            x: !(r.x1 <= x1 && x1<= r.x2),
            y: !(r.y1 <= y1 && y1 <= r.y2),
            a: (!(r.x1 <= x1 && x1<= r.x2) && !(r.y1 <= y1 && y1 <= r.y2))
        };
    }
    static inPolygon(pt, poly) {
        var x = pt[0]
        var y = pt[1];
        var inside = false;
        for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            var xi = poly[i][0], yi = poly[i][1];
            var xj = poly[j][0], yj = poly[j][1];

            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }

        return inside;
    };
}

module.exports = Utils;