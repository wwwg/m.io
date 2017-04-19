var Player = require('../entities/Player');
var log = require('../utils/Logger');
const PACKET = require('../utils/packetCodes');

class PlayerManager {
	updateTime(socket) {
		var t = this.gameServer.gameTime;
		socket.emit('dtv', t);
	}
	addPlayer(socket, player) {
		socket.emit(PACKET.PLAYER_ADD, player.player.getData(), false);
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
	sendChat(source, recipient, msg) {
		recipient.emit(PACKET.CHAT, source.player.sid, msg);
	}
	sendObj(socket, data) {
		socket.emit(PACKET.LOAD_GAME_OBJ, data);
	}
	getNearPlayers(player, avoidSelf) {
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
			if ((x1 <= px  && px <= x2) &&
				 (y1 <= py  && py <= y2)) {
					// The player is within the square
					if (players[i].player.alive) {
						if (players[i] == player && avoidSelf) {
							continue;
						}
						near.push(players[i]);
					}
					if (!player.player.playersNear.includes(players[i]) && players[i] != player) {
						// Emit player add to the socket
						this.addPlayer(player, players[i]);
						player.player.playersNear.push(players[i]);
					}
			}
		}
		player.player.playersNear = near;
		return near;
	}
	getBySID(sid) {
		for (var i = 0; i < this.players.length; ++i) {
			if (this.players[i].player.sid === sid) return this.players[i];
		}
		return null;
	}
	close(socket, reason) {
		for (var i = 0; i < this.players.length; ++i) {
			if (socket.player.sid == this.players[i].player.sid) {
				log.info('Closing socket for "' + reason + '"');
				socket.emit(PACKET.DISCONN, reason);
				socket.disconnect(reason);
				this.removeIndex(i);
				return;
			}
		}
	}
	add(socket) {
		socket.player = new Player(socket, this.players.length);
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