var Tree = require('../entities/Tree');
var Stone = require('../entities/Stone');
var GameObj = require('../entities/GameObject');
var Utils = require('../utils/Utils');

class GameManager {
	getObjsNear(socket, radius) {
		var me = this;
		var px = socket.player.x;
		var py = socket.player.y;
		var x1 = px - radius;
		var x2 = px + radius;
		var y1 = py - radius;
		var y2 = py + radius;
		var near = [];
		for (var i = 0; i < this.objs.length; ++i) {
			var x = this.objs[i].x;
			var y = this.objs[i].y;
			if ((x1 <= x && x <= x2) &&
				(y1 <= y && y <= y2)) {
				if (!socket.player.objsNear.includes(this.objs[i])) {
					near.push(this.objs[i]);
				}
			}
		}
		socket.player.objsNear = near;
		return near;
	}
	getRandCoord() {
		var me = this;
		return Utils.rand(me.gameServer.config.mapSize);
	}
	generateObjects(amount) {
		// Create random objects
		this.objLen = amount;
		for (var i = 0; i < amount; ++i) {
			// For now just generate trees
			this.objs.push(new Stone(i));
			this.objs[i].x = this.getRandCoord();
			this.objs[i].y = this.getRandCoord();
		}
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
		this.objs = [];
		this.objLen = 0;
	}
}
module.exports = GameManager;