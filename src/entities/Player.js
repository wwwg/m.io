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
		return  [
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
	getUpdateData() {
		this.dataCache = [
			this.sid,
			this.x,
			this.y,
			this.angle,
			this.buildCode,
			this.weaponCode,
			this.team,
			this.skinCode
		]
		return this.dataCache;
	}
	get attackingState() {
		return (this.autoAtk || this.attacking);
	}
	constructor(socket, sid) {
		var me = this;

		// Enviroment based properties
		this.autoAtk = false;
		this.attacking = false;
		this.hitObj = false;
		this.playersNear = [];
		this.objsNear = [];
		this.dataCache = null;
		this.angle = 0;
		this.attackDist = 10;
		this.x = -1;
		this.y = -1;

		// Connection based properties
		this.sid = sid;
		this.id = Player.getId();
		this.socket = socket;
		this.connected = false;
		this.spawned = false;
		this.alive = false;

		// Player statistics based properties
		this.health = 100;
		this.maxHealth = 100; // TODO: make this customizable
		this.name = "unknown";
		this.scale = 35; // default
		this.stone = 0;
		this.wood = 0;
		this.food = 0;
		this.score = 0; // Score is the same as gold

		// Item based properties
		this.weaponCode = 0; // 0 == Default hammer
		this.buildCode = -1; // -1 == No build item
		this.skinCode = 0; // 0 == No skin / hat

		// Movement based properties
		this.dirX = null;
		this.dirY = null;
		this.downX = false;
		this.downY = false;

		// Clan based properties
		this.team = null;
		this.clan = null;
		this.joiningClan = false;
	}
}
Player.ID_CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}.,<>';:/";
Player.ID_CHARS_LEN = Player.ID_CHARS.length; // The length of ID_CHARS doesn't need to be calculated more than once
Player.ID_LEN = 20;
module.exports = Player;