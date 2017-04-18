// External package imports
var uws = require('uws');
var io = require('socket.io');

// Local imports
var MessageHandler = require('./MessageHandler');
var Player = require('./Player');
var log = require('./utils/Logger');
var Manager = require('./PlayerManager');
var Leaderboard = require('./Leaderboard');
var Utils = require('./utils/Utils');
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

			socket.on(PACKET.PLAYER_START, data => {
				// Player spawn packet, the data is an object with one property
				return me.msgHandler.spawn.call(me, socket, data);
			});
			socket.on(PACKET.PLAYER_ANGLE, data => {
				return me.msgHandler.angle.call(me, socket, data);
			});
			socket.on('disconnect', () => {
				return me.msgHandler.disconn.call(me, socket);
			});
		});
	}
	clockCallback() {
		var me = this;
		if (me.alive) {
			for (var i = 0; i < me.manager.players.length; ++i) {
				var p = me.manager.players[i];
				if (p.player.alive) {
					// Handle alive players
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
				config.tickInterval = 350;
			}
			if (!config.mapSize) {
				config.mapSize = 12e3; // Default map size, the client currently only supports a map size of 12,000
			}
			if (!config.snowStart) {
				config.snowStart = 2400; // Default snow biom start X
			}
			if (!config.updateRadius) {
				// Players will be send information about players within 500 units of them
				config.updateRadius = 500;
			}
			this.config = config;
			this.io = null; // The socket.io server
			this.gameTime = 1; // Daytime in game
			this.currentTick = 0;
			this.alive = true;
			this.msgHandler = new MessageHandler(this);
			this.manager = new Manager(this);
			this.leaderboard = new Leaderboard(this);
			var me = this;
			me.gameClock = setInterval(() => {
				me.clockCallback.call(me); // Make sure the clock callback is called within the context of the gameServer
			}, me.config.tickInterval);
		}
	}
}

module.exports = GameServer;