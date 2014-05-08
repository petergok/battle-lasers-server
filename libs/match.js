var Constants = require('./constants');
var gcm = require('node-gcm');

function Match(playerOne, playerTwo) {
    this.playerOne = playerOne;
    this.playerTwo = playerTwo;
};

Match.prototype.sendMessage = function(message, whichPlayer) {
    console.log("Sending Message");
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
        this.sendMessage(message, 2);
    } else {
        this.sendMessage(message, 1);
    }
};

Match.prototype.userAccepted = function(playerId) {
    if (playerId === this.playerOne.playerId) {
        this.playerOne.accepted = true;
        if (!this.playerTwo.accepted) {
            return;
        }
    } else {
        this.playerTwo.accepted = true;
        if (!this.playerOne.accepted) {
            return;
        }
    }

    this.sendMessage(new gcm.Message({
        data: {
            messageType: 'matchStart'
        }
    }));
};

Match.prototype.end = function(quitPlayerId) {
    var message = new gcm.Message({
        data: {
            messageType: 'matchEnd'
        }
    });

    if (quitPlayerId === this.playerOne.playerId) {
        this.sendMessage(message, 2);
    } else {
        this.sendMessage(message, 1);
    }
};

Match.prototype.getOtherPlayerId = function(playerId) {
    if (playerId === this.playerOne.playerId) {
        return this.playerOne.playerId;
    }

    return this.playerTwo.playerId;
};

module.exports = Match;

