var Player = require('./Player');
var log = require('./utils/Logger');
const PACKET = require('./utils/packetCodes');

class PlayerManager {
	updateTime(socket) {
		var t = this.gameServer.gameTime;
		socket.emit('dtv', t);
	}
	addPlayer(socket, player) {
		socket.emit(PACKET.PLAYER_ADD, player.getData(), false);
	}
	addSelfPlayer(socket) {
		socket.emit(PACKET.PLAYER_ADD, socket.player.getData(), true);
	}
	sendRawUpdate(socket, rawData) {
		socket.emit(PACKET.PLAYER_UPDATE, rawData);
	}
	removeIndex(i) {
		this.players.splice(i, 1);
	}
	sendStart(socket) {
		socket.emit(PACKET.PLAYER_START, socket.player.sid);
	}
	getNearPlayers(player) {
		// Get all the players close to "player"
		var x = player.player.x;
		var y = player.player.y;
		// Create a square to search for players within it
		var x1 = x - this.gameServer.config.updateRadius;
		var x2 = x + this.gameServer.config.updateRadius;
		var y1 = y - this.gameServer.config.updateRadius;
		var y2 = y + this.gameServer.config.updateRadius;

		var players = this.gameServer.manager.players;
		var near = [];
		for (var i = 0; i < players.length; ++i) {
			var px = players[i].player.x;
			var py = players[i].player.y;
			if ((x1 <= px <= x2) &&
				 (y1 <= y <= y2)) {
					// The player is within the square
					near.push(players[i]);
			}
		}
		return near;
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
			if (this.players[i].player.sid == socket.player.sid) {
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