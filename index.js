var express = require('express'),
    logfmt = require('logfmt'),
    http = require('http'),
    gcm = require('./gcm'),
    app = express();

app.use(logfmt.requestLogger());

app.set('port', Number(process.env.PORT || 8080));

app.use(require('connect').bodyParser());

app.put('/registrationId', registerGCM);

function registerGCM(req, res, next) {
  'use strict';
  console.log(req.query);
  if (req.query.registrationId) {
    res.send('Registered ID');
    gcm.sendMessage(req.query.registrationId);
  } else {
    res.send('Registration ID empty');
  }
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
