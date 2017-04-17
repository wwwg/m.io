class Player {
	constructor(socket) {
		this.socket = socket;
		this.connected = false;
		this.spawned = false;
		this.sid = 0;
		this.angle = 0;
		this.name = "unknown";
	}
}
module.exports = Player;