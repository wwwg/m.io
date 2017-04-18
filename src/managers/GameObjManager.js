var Tree = require('../entities/Tree');
var GameObj = require('../entities/GameObject');
var Utils = require('../utils/Utils');

class GameManager {
	getRandCoord() {
		var me = this;
		return Utils.rand(me.gameServer.config.mapSize);
	}
	generateObjects(amount) {
		// Create random objects
		this.objLen = amount;
		for (var i = 0; i < amount; ++i) {
			// For now just generate trees
			this.objs.push(new Tree(i));
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