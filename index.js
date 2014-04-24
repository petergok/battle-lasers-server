var express = require('express');
var logfmt = require('logfmt');
var http = require('http');
var gcm = require('./gcm');

var app = express();

'use strict';

app.use(logfmt.requestLogger());

app.set('port', Number(process.env.PORT || 8080));

app.put('/registrationId', registerGCM);

function registerGCM(req, res, next) {
	'use strict';
	console.log(req.body);
    if (req.body.registrationID) {
		gcm.sendMessage(req.body.registrationID);
        res.send('Registered ID');
    } else {
		res.send('Registration ID empty');
    }
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
