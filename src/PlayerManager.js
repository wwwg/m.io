var Player = require('./Player');
var log = require('./Logger');

class PlayerManager {
	updateTime(socket) {
		var t = this.gameServer.gameTime;
		socket.emit('dtv', t);
	}
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
	remove(socket) {
		for (var i = 0; i < this.players.length; ++i) {
			if (this.players[i].sid === socket.player.sid) {
				this.removeIndex(i);
				break;
			}
		}
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
		this.players = [];
	}
}
module.exports = PlayerManager;