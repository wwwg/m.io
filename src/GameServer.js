// External package imports
var uws = require('uws');
var io = require('socket.io');

// Local imports
var MessageHandler = require('./MessageHandler');
var Player = require('./Player');
var log = require('./Logger');
var Manager = require('./PlayerManager');

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
			
			socket.on('1', data => {
				// Player spawn packet, the data is an object with one property
				return me.msgHandler.spawn.call(me, socket, data);
			});
		});
	}
	constructor(config) {
		if (!config) {
			throw new Error('Gameserver must be constructed with a configuration object.');
			return;
		} else if (!config.port || typeof config.port !== 'number') {
			throw new Error('Gameserver config requires a valid port.');
			return;
		} else {
			this.config = config;
			if (config.logLevel) { // Update log level
				log.lvl = config.logLevel;
			}
			this.io = null; // The socket.io server
			this.gameTime = 1; // Daytime in game
			this.msgHandler = new MessageHandler(this);
			this.manager = new Manager(this);
		}
	}
}

module.exports = GameServer;