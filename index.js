var express = require('express');
var logfmt = require('logfmt');
var http = require('http');
var gcm = require('node-gcm');
var mapLoader = require('./libs/mapLoader');

var Player = require('./libs/player');
var Match = require('./libs/match')

var app = express(),
    maps = mapLoader.loadMaps(),
    userRegistered = {},
    players = {},
    unmatchedUsers = [],
    matches = {},
    matches = {},
    lastId = 0;

app.use(logfmt.requestLogger());
app.use(require('connect').bodyParser());

if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}


app.set('port', Number(process.env.PORT || 8080));

app.put('/player', registerPlayer);

function registerPlayer(req, res, next) {
    'use strict';
    if (!req.query || !req.query.registrationId || !req.query.rating) {
        res.status(400).send('Parameters missing');
        return;
    }
    
    var newUser = new Player(req.query.registrationId, req.query.rating, req.query.userName);
    var hash = newUser.getGcmId();
    if (userRegistered[hash]) {
        res.send('User already registered');
        return;
    }

    userRegistered[hash] = true;
    newUser.playerId = ++lastId;
    players[newUser.playerId] = newUser;

    res.send('' + newUser.playerId);
    console.log('Added user: ' + newUser.playerId);

    var otherUser = matchUser(newUser);
    if (otherUser) {
        startMatch(otherUser, newUser);
    }
};

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

function startMatch(playerOne, playerTwo) {
    console.log("Creating match between: " + playerOne.playerId + " and " + playerTwo.playerId);

    var match = new Match(playerOne, playerTwo);
    matches[playerOne.playerId] = match;
    matches[playerTwo.playerId] = match;

    var messageToOne = new gcm.Message({
        data: {
            messageType: 'startMatch',
            otherPlayerName: playerTwo.getDisplayName(),
            playerNumber: 1,
            map: match.getMapId()
        }
    });

    var messageToTwo = new gcm.Message({
        data: {
            messageType: 'startMatch',
            otherPlayerName: playerOne.getDisplayName(),
            playerNumber: 2,
            map: match.getMapId()
        }
    });

    match.sendMessage(messageToOne, 1);
    match.sendMessage(messageToTwo, 2);
};

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
