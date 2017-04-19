var Utils = require('./Utils');

class PhysicsEngine {
	movePlayer(p) {
		// This method is called within the context of the gameServer
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