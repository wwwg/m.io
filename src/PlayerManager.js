var Player = require('./Player');
var log = require('./Logger');

class PlayerManager {
	removeIndex(i) {
		this.players.splice(i, 1);
	}
	close(socket, reason) {
		for (var i = 0; i < this.players.length; ++i) {
			if (socket.player.sid == this.players[i].sid) {
				log.info('Closing socket for "' + reason + '"');
				socket.disconnect(reason);
				this.removeIndex(i);
				break;
			}
		}
	}
	add(socket) {
		socket.player = new Player(socket);
		socket.player.sid = this.players.length;
		this.players.push(socket);
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
		this.players = [];
	}
}
module.exports = PlayerManager;