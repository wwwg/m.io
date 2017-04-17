class Player {
	static getId() {
		// Example ID: _nHpPQT_l0zYRzjUAABL
		var res = "";
		for (var i = 0; i < Player.ID_LEN; ++i) {
			res += Player.ID_CHARS[Math.floor(Math.random() * Player.ID_CHARS_LEN)];
		}
		return res;
	}
	constructor(socket) {
		this.socket = socket;
		this.connected = false;
		this.spawned = false;
		this.sid = 0;
		this.angle = 0;
		this.name = "unknown";
		this.id = Player.getId();
	}
}
Player.ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}.,<>';:/";
Player.ID_CHARS_LEN = Player.ID_CHARS.length; // The length of ID_CHARS doesn't need to be calculated more than once
Player.ID_LEN = 20;
module.exports = Player;