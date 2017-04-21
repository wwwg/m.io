var its = require('../utils/shopItems');

class Store {
	constructor(serv) {
		var me = this;
		this.serv = serv;
		this.items = its.items;
		this.itemArray = [];
		for (var p in me.items) {
			if (me.items.hasOwnProperty(p)) {
				me.itemArray.push(me.items[p]);
			}
		}
	}
}
module.exports = Store;