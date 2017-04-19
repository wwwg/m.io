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
var Minimap = require("./managers/MinimapManager");
var GameObjManager = require('./managers/GameObjManager');
var PhysicsEngine = require('./utils/PhysicsEngine');
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
			socket.on(PACKET.CLAN_CREATE, clanName => {
				return me.msgHandler.clanCreate.call(me, socket, clanName);
			});
			socket.on(PACKET.PLAYER_LEAVE_CLAN, () => {
				return me.msgHandler.clanLeave.call(me, socket);
			})
			socket.on(PACKET.CLAN_REQ_JOIN, sid => {
				return me.msgHandler.clanJoin.call(me, socket, sid);
			});
			socket.on(PACKET.CLAN_ACC_JOIN, (sid, join) => {
				return me.msgHandler.notificationResponse.call(me, socket, sid, join);
			});
			socket.on(PACKET.CLAN_KICK, sid => {
				return me.msgHandler.clanKick.call(me, socket, sid);
			});
			socket.on(PACKET.AUTO_ATK, () => {
				return me.msgHandler.autoAttack.call(me, socket);
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
					var moveCoords = me.phys.movePlayer.call(me, p);
					var mx = moveCoords[0];
					var my = moveCoords[1];
					var collideSet = me.phys.playerCollision.call(me, p);
					var shouldMoveX = collideSet[0];
					var shouldMoveY = collideSet[1];
					// Retest movement for border collision
					if (shouldMoveX || shouldMoveY) {
						/*
							The reason why shouldMoveX/Y is tested
							for twice is to ensure that the border
							collision is only calculated when the player
							should move.
						*/
						collideSet = me.phys.borderCollision.call(me, mx, my);
						if (shouldMoveX) {
							shouldMoveX = collideSet[0];
						}
						if (shouldMoveY) {
							shouldMoveY = collideSet[1];
						}

						// Update coords if needed
						if (mx && shouldMoveX) {
							p.player.x = mx;
						}
						if (my && shouldMoveY) {
							p.player.y = my;
						}
					}

					// Update the players around the player
					var near = me.manager.getNearPlayers(p);
					// Get raw player data and send to the user
					var sdata = Utils.serializePlayerArray(near);
					me.manager.sendRawUpdate(p, sdata);

					// Update game objects
					var objsNear = me.objs.getObjsNear(p, me.config.updateRadius);
					var oData = [];
					for (var j = 0; j < objsNear.length; ++j) {
						oData = oData.concat(objsNear[j].serialize());
					}
					me.manager.sendObj(p, oData);
				} else {
					// Handle dead / idle players
				}
			}
			// TODO: Implement more clock based game logic
			me.currentTick++;
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
				config.updateRadius = 1500;
			}
			if (!config.playerSpeed) {
				// Amount of units to move each game tick
				config.playerSpeed = 80;
			}
			if (!config.snowSpeed) {
				// Speed of the player while in the snow biome
				config.snowSpeed = config.playerSpeed / 1.25;
			}
			if (!config.statUpdateSpeed) {
				// Minimap and leaderboard update speed
				config.statUpdateSpeed = 2000;
			}
			if (!config.leaderboardCount) {
				config.leaderboardCount = 10;
			}
			if (!config.maxPlayers) {
				// The default servers only allow 50 players
				config.maxPlayers = 50;
			}
			var me = this;
			this.config = config;
			this.io = null; // The socket.io server
			this.gameTime = 1; // Daytime in game
			this.currentTick = 0;
			this.alive = true;
			this.msgHandler = new MessageHandler(me);
			this.manager = new Manager(me);
			this.leaderboard = new Leaderboard(me);
			this.clans = new ClanManager(me);
			this.minimap = new Minimap(me);
			this.objs = new GameObjManager(me);
			this.phys = new PhysicsEngine(me);
			this.objs.generateObjects(100);
			me.gameClock = setInterval(() => {
				me.tick.call(me); // Make sure the clock callback is called within the context of the gameServer
			}, me.config.tickInterval);
		}
		global.gameServer = me;
	}
}

module.exports = GameServer;