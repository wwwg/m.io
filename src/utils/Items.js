class Item {
	build(socket) {
		socket.player.stone -= this.costs.stone;
		socket.player.wood -= this.costs.wood;
		socket.player.food -= this.costs.food;
		socket.player.buildCode = this.id;
	}
	constructor(id, use, buildable) {
		this.id = id;
		this.use = use;
		this.costs = {
			stone: 0,
			wood: 0,
			food: 0
		}
	}
}
var items = [];
items[0] = new Item(0, me => { // Apple
	var heal = 20;
	console.log(me.health);
	if (me.health === me.maxHealth) {
		return;
	} else if (me.health + heal > me.maxHealth) {
		// Only heal what is needed
		me.health = me.maxHealth;
	} else {
		me.health += heal;
	}
	me.buildCode = -1;
	console.log(me.health);
}, false);
items[0].costs.food = 20;

module.exports = {
	Item: Item,
	items: items
}