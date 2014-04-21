var express = require('express');
var app = express();
var server = require('http').createServer(app).listen(8080);
var io = require('socket.io').listen(server);
var battleLasers = require('./battleLasers');

io.sockets.on('connection', function (socket) {
    console.log('client connected');
    battleLasers.initGame(io, socket);
});


