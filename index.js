var express = require('express');
var logfmt = require('logfmt');
var http = require('http');
var gcm = require('node-gcm');

var Player = require('./libs/player');

var app = express(),
    userRegistered = {},
    players = {},
    unmatchedUsers = [],
    matches = {},
    ips = {},
    greylist = {},
    lastId = 0;

app.use(logfmt.requestLogger());

app.set('port', Number(process.env.PORT || 8080));

app.use(require('connect').bodyParser());

app.put('/player', registerPlayer);

clearIps();
clearGreylist();

function clearIps () {
    ips = {};
    setTimeout(clearIps, 5000);
};

function clearGreylist () {
    greylist = {};
    setTimeout(clearGreylist, 43200000);
};

function registerPlayer(req, res, next) {
    'use strict';
    if (!req.query || !req.query.registrationId || !req.query.rating || greylist[req.ip]) {
        res.status(400).send('Parameters missing');
        return;
    }

    console.log(ips[req.ip] + " " + req.ip);

    if (ips[req.ip]) {
        ips[req.ip]++;
        if (ips[req.ip] > 10) {
            greylist[req.ip] = true;
        }
    } else {
        ips[req.ip] = 1;
    }
    
    var newUser = new Player(req.query.registrationId, req.query.rating);
    var hash = newUser.hashCode();
    if (!userRegistered[hash]) {
        userRegistered[hash] = true;
        newUser.playerId = ++lastId;
        players[newUser.playerId] = newUser;

        res.send('' + newUser.playerId);
        console.log('Added user: ' + newUser.playerId);

        var otherUser = matchUser(newUser);
        if (otherUser) {
            startMatch(otherUser, newUser);
        }
    }

    res.send('User already registered');
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

function startMatch(firstPlayer, secondPlayer) {
    console.log("Creating match between: " + firstPlayer.playerId + " and " + secondPlayer.playerId);
};

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
