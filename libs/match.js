var Constants = require('./constants');

function Match(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
};

Match.prototype.sendMessage = function(message, whichPlayer) {
    if (whichPlayer) {
        if (whichPlayer === 1) {
            playerOne.sendMessage(message);
        } else if (whichPlayer === 2) {
            playerTwo.sendMessage(message);
        }
    } else {
        playerone.sendMessage(message);
        playerTwo.sendMessage(message);
    }
};

Match.prototype.getMapId = function() {
    if (!this.mapId) {
        this.mapId = (Math.random() * Constants.NUMBER_OF_MAPS) | 0;
    }
     
    return this.mapId;
};

module.exports = Match;

