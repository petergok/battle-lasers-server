var Constants = require('./constants');

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

module.exports = Match;

