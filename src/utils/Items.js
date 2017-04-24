class Item {
	constructor(id, use, buildable) {
		this.id = id;
		this.use = use;
	}
}
var items = [
	new Item(0, me => { // Apple
		me.health += 20;
	}, false),
	new Item(3, me => { // Cookie
		me.health += 40;
	}, false),
	new Item(4, me => {
		// TODO: Add buildables
	}, true)
];
module.exports = {
	Item: Item,
	items: items
}