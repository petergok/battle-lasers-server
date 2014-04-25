var Constants = require('./constants');

var gcm = require('node-gcm');

function Player(gcmPushId, rating) {
	this.gcmPushId = gcmPushId;
	this.rating = rating;
}

Player.prototype.hashCode = function() {
    return this.gcmPushId;
};

Player.prototype.canPlay = function(otherUser) {
    if (otherUser && otherUser.rating) {
        var diff = otherUser.rating - this.rating;
        return (diff > -400 && diff < 400);
    }
    return false;
};

Player.prototype.sendMessage = function(message) {
    var sender = new gcm.Sender(Constants.GCM_API_KEY),
        registrationIds = [];

    registrationIds.push(this.gcmPushId);

    console.log('Sending message to user: ' + this.playerId + ', message is: ' + message);

    sender.send(message, registrationIds, 4, function(err, result) {
        console.log(result);
    });
};

module.exports = Player;
