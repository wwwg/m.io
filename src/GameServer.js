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
			socket.on(PACKET.PLAYER_ATTACK, (atk, buildDir) => {
				return me.msgHandler.attack.call(me, socket, atk, buildDir);
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
				// Update the players around the player
				var near = me.manager.getNearPlayers(p);
				var objsNear = me.objs.getObjsNear(p,
												   me.config.updateRadius);

				if (p.player.alive) {
					// Handle alive players
					if (me.phys.needsToMove(p)) {
						// Handle player movement
						var moveCoords = me.phys.movePlayer.call(me, p);
						var mx = moveCoords[0];
						var my = moveCoords[1];
						// Handle player playerCollisionon
						var pcollide = me.phys.playerCollision.call(me, p, mx, my);
						var shouldMoveX = pcollide;
						var shouldMoveY = pcollide;
						if (shouldMoveX || shouldMoveY) {
							// Handle game object collision
							var ocollide = me.phys.objectCollision.call(me, p, mx, my);
							shouldMoveX = ocollide;
							shouldMoveY = ocollide;
							/*
								Retest movement for border collision
								The reason why shouldMoveX/Y is tested
								more than one is to ensure that the border
								collision is only calculated when the player
								should move.
							*/
							if (shouldMoveX || shouldMoveY) {
								var bcollide = me.phys.borderCollision.call(me, mx, my);
								if (shouldMoveX === true) {
									shouldMoveX = bcollide[0];
								}
								if (shouldMoveY === true) {
									shouldMoveY = bcollide[1];
								}
							}
							// Update coords if needed
							if (shouldMoveX) {
								p.player.x = mx;
							}
							if (shouldMoveY) {
								p.player.y = my;
							}
						}
					}
					// Get raw player data and send to the user
					var sdata = Utils.serializePlayerArray(near);
					me.manager.sendRawUpdate(p, sdata);

					// Update game objects
					var oData = [];
					for (var j = 0; j < objsNear.length; ++j) {
						oData = oData.concat(objsNear[j].serialize());
					}
					me.manager.sendObj(p, oData);
				} else {
					// Handle dead / idle players
				}
			}
			me.currentTick++;
		}
	}
	attackTick() {
		var me = this;
		if (me.alive) {
			for (var i = 0; i < me.manager.players.length; ++i) {
				var p = me.manager.players[i];
				if (p.player.alive) {
					var al = me.phys.getAttackLocation(p);
					if (p.player.attackingState) {
						var objn = me.objs.objs;
						for (var j = 0; j < objn.length; ++j) {
							var o = objn[j];
							var objHit = me.phys.inEntity({
								x: al[0],
								y: al[1]
							}, o, o.scale);
							if (objHit) {
								// Player has hit object
								me.manager.hitObject(p, o);
							}
						}
						var near = me.manager.players;
						for (var j = 0; j < near.length; ++j) {
							if (p.player.attackingState) {
								// Alert nearby players of the attack start
								me.manager.sendAttack(near[j], p, p.player.hitObj);
								// Handle player attacking
								var playerHit = me.phys.inEntity({
									x: al[0],
									y: al[1]
								}, {
									x: near[j].player.x,
									y: near[j].player.y
								}, near[j].player.scale * 2);
								if (playerHit && p != near[j]) {
									me.manager.hitPlayer(p, near[j]);
								}
							}
						}
					}
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
				config.updateRadius = 1500;
			}
			if (!config.playerSpeed) {
				// Amount of units to move each game tick
				config.playerSpeed = 60;
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
			if (!config.gameObjects) {
				// The amount game objects in the world
				config.gameObjects = 200; 
			}
			if (!config.gatherMultiplier) {
				config.gatherMultiplier = 1;
			}
			if (!config.saveStats) {
				// Whether or not player's stats are saved upon death
				config.saveStats = false;
			}
			var me = this;
			this.config = config;
			this.atkInterval = config.tickInterval * 2;
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
			this.objs.generateObjects(config.gameObjects);
			me.gameClock = setInterval(() => {
				me.tick.call(me); // Make sure the clock callback is called within the context of the gameServer
			}, me.config.tickInterval);
			me.attackClock = setInterval(() => {
				me.attackTick.call(me);
			}, me.atkInterval);
		}
		global.gameServer = me;
	}
}

module.exports = GameServer;