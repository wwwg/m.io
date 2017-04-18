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
        return (c <= (bounds - 10) && c >= 10);
    }
    static coordsInBounds(x, y, bounds) {
        return ((x <= (bounds - 10) && y <= (bounds - 10)) &&
                    (x >= 10 && y >= 10));
    }
}

module.exports = Utils;