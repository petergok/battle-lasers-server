var io,
    gameSocket;

exports.initGame = function(sio, socket) {
	io = sio;
	gameSocket = socket;
	gameSocket.emit('connected', {message: "You are connected!"});

	// Events
	gameSocket.on('createNewGame', createNewGame);
	gameSocket.on('joinGame', joinGame);
}

function createNewGame(data) {
	// Create a unique Socket.IO Room
	var thisGameId = (Math.random() * 100000) | 0;

	// Return the Room ID and the socket ID
	this.emit('newGameCreated', {gameId: thisGameId, mySocketId: this.id});

	// Join the Room and wait for the players
	this.join(thisGameId.toString());
};

function joinGame(data) {
}
