class Player {
	static getId() {
		// Example ID: _nHpPQT_l0zYRzjUAABL
		var res = "";
		for (var i = 0; i < Player.ID_LEN; ++i) {
			res += Player.ID_CHARS[Math.floor(Math.random() * Player.ID_CHARS_LEN)];
		}
		return res;
	}
	getData() {
		return [
			this.id,
			this.sid,
			this.name,
			this.x,
			this.y,
			this.angle,
			this.health,
			this.maxHealth,
			this.scale
		];
	}
	constructor(socket) {
		this.socket = socket;
		this.connected = false;
		this.spawned = false;
		this.sid = 0;
		this.angle = 0;
		this.x = -1;
		this.y = -1;
		this.name = "unknown";
		this.id = Player.getId();
		this.scale = 35; // default
		this.health = 100;
		this.maxHealth = 100; // default
		this.dirX = null;
		this.dirY = null;
		this.score = 0; // Score is the same as gold
	}
}
Player.ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}.,<>';:/";
Player.ID_CHARS_LEN = Player.ID_CHARS.length; // The length of ID_CHARS doesn't need to be calculated more than once
Player.ID_LEN = 20;
module.exports = Player;