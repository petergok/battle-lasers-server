var Mirror = require('./mirror');

function Map(maps, id) {
    this.id = id;

    var map = maps[id];
    this.numberOfMaps = map.numberOfMaps;

    this.mirrors = [];
    for (var mirrorIndex = 0; mirrorIndex < this.numberOfMirrors; mirrorIndex++) {
        this.mirrors.push(new Mirror(map.rows[mirrorIndex], map.columns[mirrorIndex], map.isHorizontal[mirrorIndex]));
    }
};

module.exports = Map;