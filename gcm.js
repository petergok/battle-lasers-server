var gcm = require('node-gcm');

'use strict';

exports.sendMessage = function(registrationId) {

	'use strict';

	var message = new gcm.Message();

	var sender = new gcm.Sender('AIzaSyCENav9tqNV4fDKDPpU9eCkC96EAPkDU2I');
	var registrationIds = [];

	message.addDataWithKeyValue('key1','message1');

	message.collapseKey = 'demo';
	message.delayWhileIdl = true;
	message.timeToLive = 3;

	registrationIds.push(registrationId);

	console.log('sending message');

	sender.send(message, registrationIds, 4, function(err, result) {
	    console.log(result);
	    console.log(err);
	});
}
