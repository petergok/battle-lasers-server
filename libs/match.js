var Constants = require('./constants');
var gcm = require('node-gcm');

function Match(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
};

Match.prototype.sendMessage = function(message, whichPlayer) {
    if (whichPlayer) {
        if (whichPlayer === 1) {
            this.playerOne.sendMessage(message);
        } else if (whichPlayer === 2) {
            this.playerTwo.sendMessage(message);
        }
    } else {
        this.playerOne.sendMessage(message);
        this.playerTwo.sendMessage(message);
    }
};

Match.prototype.getMapId = function() {
    if (!this.mapId) {
        this.mapId = (Math.random() * Number(Constants.NUMBER_OF_MAPS)) | 0;
    }
     
    return this.mapId;
};

Match.prototype.makeMove = function (startX, startY, endX, endY, playerId) {
    var message = new gcm.Message({
        data: {
            messageType: 'move',
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY
        }
    });

    if (playerId == playerOne.playerId) {
        this.playerTwo.sendMessage(message);
    } else {
        this.playerOne.sendMessage(message);
    }
};

module.exports = Match;

