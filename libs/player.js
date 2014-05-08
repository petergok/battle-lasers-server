var Constants = require('./constants');

var gcm = require('node-gcm');

var sender = new gcm.Sender(Constants.GCM_API_KEY);

function Player(gcmPushId, rating, userName) {
	this.gcmPushId = gcmPushId;
	this.rating = rating;
    this.userName = userName;
};

Player.prototype.getGcmId = function() {
    return this.gcmPushId;
};

Player.prototype.getDisplayName = function() {
    if (this.userName) {
        return this.userName;
    } else {
        return 'Anonymous';
    }
};

Player.prototype.canPlay = function(otherUser) {
    if (otherUser && otherUser.rating) {
        var diff = otherUser.rating - this.rating;
        return (diff >= -400 && diff <= 400);
    }
    return false;
};

Player.prototype.getRating = function() {
    return this.rating;
}

Player.prototype.sendMessage = function(message) {
    var registrationIds = [];

    registrationIds.push(this.gcmPushId);

    console.log('Sending message to user: ' + this.playerId + ', message is: ' + message);

    sender.send(message, registrationIds, 4, function(err, result) {
        console.log(result);
        console.log(err);
    });
};

module.exports = Player;
