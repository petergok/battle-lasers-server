var fs = require('fs');
var Map = require('./map');

exports.loadMaps = function() {
    var maps = [];

    fs.readFile('./data/maps.json', 'ascii', function (err,data) {
        if (err) {
            return console.log(err);
        }

        data = JSON.parse(data);

        var loadedMaps = data.maps;
        for (var id = 0; id < loadedMaps.length; id++) {
            maps.push(new Map(loadedMaps, id));
        }
    });

    return maps;
};