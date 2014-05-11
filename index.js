var express = require('express');
var logfmt = require('logfmt');
var http = require('http');
var gcm = require('node-gcm');
var mapLoader = require('./libs/mapLoader');

var Player = require('./libs/player');
var Match = require('./libs/match');

var app = express(),
    maps = mapLoader.loadMaps(),
    userRegistered = {},
    players = {},
    unmatchedUsers = [],
    matches = {},
    lastId = 0;

app.use(logfmt.requestLogger());
app.use(require('connect').bodyParser());

app.set('port', Number(process.env.PORT || 8080));

app.put('/player', registerPlayer);
app.put('/player/:id/accept', acceptMatch);
app.put('/player/:id/decline', declineMatch);
app.put('/player/:id/move', makeMove);
app.delete('/player/:id', deletePlayer);

function clearData() {
    for (var key in players) {
        console.log("clearing data");
        var player = players[key];
        var currentTime = new Date().getTime();
        if (currentTime > player.timeRegistered) {
            console.log("deleting player");
            endMatch(player.playerId, null, false);
        }
    }
    setInterval(clearData, 10000);
};

clearData();

function registerPlayer(req, res, next) {
    'use strict';
    console.log(req.body);
    if (!req.body || !req.body.registrationId || !req.body.rating || !Number(req.body.rating)) {
        res.status(400).send('Body invalid');
        return;
    }
    
    var newUser = new Player(req.body.registrationId, Number(req.body.rating), req.body.userName);
    addPlayer(newUser, res);
    res.send('Player registered');
};

function addPlayer(newUser, res) {
    var gcmId = newUser.getGcmId();
    // User already registered
    if (userRegistered[gcmId]) {
        var playerId = userRegistered[gcmId].playerId;
        if (matches[playerId]) {
            endMatch(playerId, res, false);
            return;
        }
        res.send('' + userRegistered[gcmId].playerId);
        return;
    }

    userRegistered[gcmId] = newUser;
    var timeRegistered = new Date().getTime;
    newUser.timeRegistered = timeRegistered;

    newUser.playerId = ++lastId;
    players[newUser.playerId] = newUser;

    res.send('' + newUser.playerId);
    console.log('Added user: ' + newUser.playerId);

    var otherUser = matchUser(newUser);
    if (otherUser) {
        startMatch(otherUser, newUser, timeRegistered);
    }
};

function makeMove(req, res, next) {
    var match = matches[Number(req.params.id)];
    if (!match) {
        res.send('Match not found');
        return;
    }
        
    var body = req.body;
    if (!body || !body.startRow || !body.startCol || !body.endRow || !body.endCol) {
        res.status(400).send('Body invalid');
        return;
    }

    match.makeMove(body.startRow, body.startCol, body.endRow, body.endCol, body.turnRight, Number(req.params.id));
    
    res.send('Move successfully made');
};

function deletePlayer(req, res, next) {
    endMatch(Number(req.params.id), res, true);
    res.send('Delete completed');
};

function acceptMatch(req, res, next) {
    var playerId = Number(req.params.id);
    var match = matches[playerId];

    match.userAccepted(playerId);
    res.send('User accepted');
};

function declineMatch(req, res, next) {
    endMatch(Number(req.params.id), res, true);
    res.send('Match declined');
};

function endMatch(playerId, res, sendResponse) {
    var quitPlayer = players[playerId];

    if (quitPlayer === undefined) {
        if (sendResponse) {
            res.send('Player already deleted');
        }
        return;
    }

    var match = matches[playerId];
    if (match) {
        match.end(playerId);
        var otherPlayerId = match.getOtherPlayerId(playerId);
        var otherPlayer = players[otherPlayerId];
        delete match[playerId];
        delete match[otherPlayerId];
        delete players[quitPlayer];
        delete players[otherPlayerId];
        delete userRegistered[quitPlayer.getGcmId()];
        delete userRegistered[otherPlayer.getGcmId()];
        if (sendResponse) {
            res.send('Match and Player deleted successfully');
        }
        return;
    }

    var unmatchedIndex = unmatchedUsers.indexOf(quitPlayer);
    if (unmatchedIndex >= 0) {
        unmatchedUsers.splice(unmatchedIndex, 1);
    }

    delete userRegistered[quitPlayer.getGcmId()];
    delete players[playerId];
    if (sendResponse) {
        res.send('Player only successfully deleted');
    }
}

function matchUser(newUser) {
    if (unmatchedUsers.length) {
        for (var index = 0; index < unmatchedUsers.length; index++) {
            if (newUser.canPlay(unmatchedUsers[index])) {
                return unmatchedUsers.splice(index, 1)[0];
            }
        }
    }

    unmatchedUsers.push(newUser);
    return undefined;
};

function startMatch(playerOne, playerTwo, timeRegistered) {
    console.log("Creating match between: " + playerOne.playerId + " and " + playerTwo.playerId);

    var match = new Match(playerOne, playerTwo);

    playerOne.timeRegistered = timeRegistered;
    playerTwo.timeRegistered = timeRegistered;
    match.timeRegistered = timeRegistered;

    matches[playerOne.playerId] = match;
    matches[playerTwo.playerId] = match;

    var messageToOne = new gcm.Message({
        data: {
            messageType: 'matchFound',
            otherPlayerName: playerTwo.getDisplayName(),
            otherPlayerRating: playerTwo.getRating(),
            playerNumber: 1,
            mapId: match.getMapId()
        }
    });

    var messageToTwo = new gcm.Message({
        data: {
            messageType: 'matchFound',
            otherPlayerName: playerOne.getDisplayName(),
            otherPlayerRating: playerOne.getRating(),
            playerNumber: 2,
            mapId: match.getMapId()
        }
    });

    match.sendMessage(messageToOne, 1);
    match.sendMessage(messageToTwo, 2);
};

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
