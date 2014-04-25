var express = require('express');
var logfmt = require('logfmt');
var http = require('http');

var Player = require('./libs/player');

var app = express(),
    users = {};

app.use(logfmt.requestLogger());

app.set('port', Number(process.env.PORT || 8080));

app.use(require('connect').bodyParser());

app.put('/registrationId', registerGCM);

function registerGCM(req, res, next) {
    'use strict';
    console.log(req.query);
    if (!req.query || !req.query.registrationId || !req.query.esn) {
        res.status(400).send('Parameters missing');
        next();
    }
    
    var newUser = new Player(req.query.registrationId, req.query.esn, req.query.rating);
    users[newUser.hashCode()] = newUser;

    console.log(users);
}

app.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
