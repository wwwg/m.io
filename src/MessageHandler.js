var Player = require('./Player');
var log = require('./Logger');

class MessageHandler {
	checkConnection(socket) {
		if (!socket.player.connected) {
			this.manager.close(socket, 'Connection handshake not completed.');
		}
		return socket.player.connected;
	}
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
		if (!this.checkConnection())
			return;
		console.log('Player spawn packet send with data', data);
		// TODO: Handle player spawn
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
	}
}
module.exports = MessageHandler;