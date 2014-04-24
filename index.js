var express = require('express');
var logfmt = require('logfmt');
var http = require('http');
var gcm = require('./gcm');

var app = express();

'use strict';

app.use(logfmt.requestLogger());

app.set('port', process.env.PORT || 8080);

app.put('/registrationId', registerGCM);

function registerGCM(req, res, next) {
	'use strict';
    if (req.registrationID) {
		gcm.sendMessage(req.registrationID);
        res.send('Registered ID');
    } else {
	res.send('Registration ID empty');
    }
}
