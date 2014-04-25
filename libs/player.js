var Constants = require('./constants');

var gcm = require('node-gcm');

function Player(esn, gcmPushId, rating) {
	this.esn = esn;
	this.gcmPushId = gcmPushId;
	this.rating = rating;
}

Player.prototype.hashCode = function() {
    return this.esn;
};

Player.prototype.sendMessage = function(message) {
    var sender = new gcm.Sender(Constants.GCM_API_KEY),
        registrationIds = [];

    registrationIds.push(this.gcmPushId);

    console.log('Sending message to user: ' + this.esn + ', message is: ' + message);

    sender.send(message, registrationIds, 4, function(err, result) {
        console.log(result);
    });
};

module.exports = Player;
