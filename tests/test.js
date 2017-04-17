var GameServer = require('../src/GameServer');
var gs = new GameServer({
	port: 5050,
	logLevel: 0
});
gs.start();