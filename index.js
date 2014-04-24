var express = require('express');
var logfmt = require('logfmt');
var http = require('http');
var gcm = require('./gcm');

var app = express();

'use strict';

app.use(logfmt.requestLogger());

app.set('port', Number(process.env.PORT || 8080));

app.use(require('connect').bodyParser());

app.put('/registrationId', registerGCM);

function registerGCM(req, res, next) {
	'use strict';
	console.log(req.query);
    if (req.query.registrationID) {
    	res.send('Registered ID');
		gcm.sendMessage(req.query.registrationID);
    } else {
		res.send('Registration ID empty');
    }
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
