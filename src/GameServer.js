// External package imports
var uws = require('uws');
var io = require('socket.io');

// Local imports
var MessageHandler = require('./managers/MessageHandler');
var Player = require('./entities/Player');
var log = require('./utils/Logger');
var Manager = require('./managers/PlayerManager');
var Leaderboard = require('./entities/Leaderboard');
var Utils = require('./utils/Utils');
var ClanManager = require('./managers/ClanManager');
const PACKET = require('./utils/packetCodes');

class GameServer {
	start() {
		var me = this;
		me.io = io(me.config.port);
		// Set the server websocket engine to uws, for massive performance gain
		me.io.engine.ws = new uws.Server({
			noServer: true,
			clientTracking: false,
			perMessageDeflate: false
		});
		log.info('Started GameServer on port ' + me.config.port);
		me.io.on('connection', socket => {
			log.all('New connection accepted.');
			this.manager.add(socket);
			me.msgHandler.conn.call(me, socket);

			// Attach packet handlers
			socket.on(PACKET.PLAYER_START, data => {
				// Player spawn packet, the data is an object with one property
				return me.msgHandler.spawn.call(me, socket, data);
			});
			socket.on(PACKET.PLAYER_ANGLE, data => {
				return me.msgHandler.angle.call(me, socket, data);
			});
			socket.on(PACKET.PLAYER_MOVE, (key, down) => {
				return me.msgHandler.move.call(me, socket, key, down);
			});
			socket.on(PACKET.CHAT, msg => {
				return me.msgHandler.chat.call(me, socket, msg);
			});
			socket.on('disconnect', () => {
				return me.msgHandler.disconn.call(me, socket);
			});
		});
	}
	tick() {
		var me = this;
		if (me.alive) {
			for (var i = 0; i < me.manager.players.length; ++i) {
				var p = me.manager.players[i];
				if (p.player.alive) {
					// Handle alive players

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
					// Update coords if needed
					if (mx &&
					     Utils.coordInBounds(mx, me.config.mapSize)) {
						p.player.x = mx;
					}
					if (my &&
					     Utils.coordInBounds(my, me.config.mapSize)) {
						p.player.y = my;
					}

					// Update the players around the player
					var near = me.manager.getNearPlayers(p);
					// Get raw player data and send to the user
					var sdata = Utils.serializePlayerArray(near);
					me.manager.sendRawUpdate(p, sdata);
				} else {
					// Handle dead / idle players
				}
			}
			// TODO: Implement more clock based game logic
			me.currentTick++;
		}
	}
	mmUpdate() {
		var me = this;
			if (me.alive) {
				for (var i = 0; i < me.manager.players.length; ++i) {
					var p = me.manager.players[i];
					if (p.player.alive) {
						p.player.socket.emit("mm", 0);
						/*when clans are added
						var mapCords = [];
						for (var m = 0; m < clanMembers.length; m++) {
							var member = clanMembers[m];
							mapCords.push(member.x);
							mapCords.push(member.y);
						}*/
					}
				}
			}
	}
	constructor(config) {
		if (!config) {
			throw new Error('Gameserver must be constructed with a configuration object.');
			return;
		} else if (!config.port || typeof config.port !== 'number') {
			throw new Error('Gameserver config requires a valid port.');
			return;
		} else {
			if (config.logLevel) { // Update log level
				log.lvl = config.logLevel;
			}
			// Adjust configuration
			if (!config.unknownName) {
				config.unknownName = "unknown";
			}
			if (!config.tickInterval) {
				config.tickInterval = 170;
			}
			if (!config.mapSize) {
				config.mapSize = 12e3; // Default map size, the client currently only supports a map size of 12,000
			}
			if (!config.snowStart) {
				config.snowStart = 2400; // Default snow biom start Y
			}
			if (!config.updateRadius) {
				// Players will be send information about players within 500 units of them
				config.updateRadius = 500;
			}
			if (!config.playerSpeed) {
				// Amount of units to move each game tick
				config.playerSpeed = 60;
			}
			if (!config.snowSpeed) {
				// Speed of the player while in the snow biome
				config.snowSpeed = config.playerSpeed / 1.5;
			}
			if (!config.mapInt) {
				//minimap refresh rate in MS
				config.mapInt = 1000;
			}
			this.config = config;
			this.io = null; // The socket.io server
			this.gameTime = 1; // Daytime in game
			this.currentTick = 0;
			this.alive = true;
			this.msgHandler = new MessageHandler(this);
			this.manager = new Manager(this);
			this.leaderboard = new Leaderboard(this);
			this.clans = new ClanManager(this);
			var me = this;
			me.gameClock = setInterval(() => {
				me.tick.call(me); // Make sure the clock callback is called within the context of the gameServer
			}, me.config.tickInterval);
			me.minimapUpdate = setInterval(()=> {
				me.mmUpdate.call(me);
			}, me.config.mapInt);
		}
		global.gameServer = me;
	}
}

module.exports = GameServer;
