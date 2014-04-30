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

Match.prototype.makeMove = function (startRow, startCol, endRow, endCol, turnRight, playerId) {
    var message = new gcm.Message({
        data: {
            messageType: 'move',
            turnRight: turnRight,
            startRow: 11 - startRow,
            startCol: startCol,
            endRow: 11 - endRow,
            endCol: endCol
        }
    });

    if (playerId === this.playerOne.playerId) {
        this.playerTwo.sendMessage(message);
    } else {
        this.playerOne.sendMessage(message);
    }
};

Match.prototype.endGame = function(quitPlayerId) {
    var message = new gcm.Message({
        data: {
            messageType: 'endGame'
        }
    });

    if (quitPlayerId === this.playerOne.playerId) {
        this.playerTwo.sendMessage(message);
    } else {
        this.playerOne.sendMessage(message);
    }
};

Match.prototype.getOtherPlayerId = function(playerId) {
    if (playerId === this.playerOne.playerId) {
        return this.playerOn.playerId;
    }

    return this.playerTwo.playerId;
};

module.exports = Match;

