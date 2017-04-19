var Utils = require('./Utils');

class PhysicsEngine {
	playerCollision(p) {
		// Method is called within the context of the GameServer
		var me = this;
		var shouldMoveX = true;
		var shouldMoveY = true;
		for (var j = 0; j < me.manager.players.length; ++j) {
			var p2 = me.manager.players[j];
			if (p == p2 || p2.alive === false)
				continue;
			var px = p2.player.x;
			var py = p2.player.y;
			var cx = mx || p.player.x;
			var cy = my || p.player.y;
			var canMove = Utils.checkCollide(cx, cy, px, py, 6);
			shouldMoveX = canMove.x || canMove.y;
			shouldMoveY = canMove.y || canMove.x;
		}
		return [
			shouldMoveX,
			shouldMoveY
		];
	}
	movePlayer(p) {
		// This method is called within the context of the GameServer
		var me = this;
		// The current PhysicsEngine instance
		var phys = me.phys;
		// Move player
		var mx = null;
		var my = null;
		var speed = me.config.playerSpeed;
		if (Utils.isInSnow(p)) {
			speed = me.config.snowSpeed;
		}
		if (p.player.downX) {
			// The player needs to be translated across the X axis
			if (p.player.dirX == "l") {
				// Player moves left
				mx = p.player.x - speed;
			} else if (p.player.dirX == "r") {
				// Player moves right
				mx = p.player.x + speed;
			}
		}
		if (p.player.downY) {
			// The player needs to be translated across the Y axis
			if (p.player.dirY == "u") {
				// Player moves up
				my = p.player.y - speed;
			} else if (p.player.dirY == "d") {
				// Player moves down
				my = p.player.y + speed;
			}
		}
		return [
			mx,
			my
		];
	}
	constructor(serv) {
		this.serv = serv;
	}
}
module.exports = PhysicsEngine;