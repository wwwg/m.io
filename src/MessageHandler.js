class MessageHandler {
	spawn(socket, data) {
		console.log('Player spawn packet send with data', data);
		// TODO: Handle player spawn
	}
	constructor(gameServer) {
		this.gameServer = gameServer;
	}
}
module.exports = MessageHandler;