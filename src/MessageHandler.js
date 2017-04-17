var Player = require('./Player');
var log = require('./Logger');

class MessageHandler {
	connPacket(socket) {
		log.all('Socket sent connect packet.');
		if (socket.player.connected) {
			// For some reason the client sent a connection packet while already connected
			this.manager.close(socket, 'Invalid connection packet sent');
		} else {
			// The client is now connected
			socket.player.connected = true;
		}
	}
	spawn(socket, data) {
		console.log('Player spawn packet send with data', data);
		// TODO: Handle player spawn
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
	}
}
module.exports = MessageHandler;