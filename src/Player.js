class Player {
	constructor(socket) {
		this.socket = socket;
		this.connected = false;
		this.sid = 0;
		this.angle = 0;
	}
}
module.exports = Player;