var Player = require('./Player');
var log = require('./Logger');

class MessageHandler {
	checkConnection(socket) {
		if (!socket.player.connected) {
			this.manager.close(socket, 'Connection handshake not completed.');
		}
		return socket.player.connected;
	}
	conn(socket) {
		if (socket.player.connected) {
			// For some reason the client sent a connection packet while already connected
			this.manager.close(socket, 'Invalid connection');
		} else {
			// The client is now connected
			socket.player.connected = true;
			// Update the player's time
			this.manager.updateTime(socket);
		}
	}
	angle(socket, ang) {
		// Player angle update
		socket.player.angle = ang;
	}
	spawn(socket, data) {
		if (!this.msgHandler.checkConnection(socket))
			return;
		if (socket.player.spawned) {
			this.manager.close(socket, 'You are already spawned.');
		} else {
			// Player can spawn 
			var name = data.name.trim();
			if (name === "") 
				name = this.config.unknownName;
			socket.player.name = name;
		}
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
	}
}
module.exports = MessageHandler;