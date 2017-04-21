var its = require('../utils/shopItems');

class Store {
	getItemById(id) {
		var me = this;
		for (var i = 0; i < me.itemArray.length; ++i) {
			if (me.itemArray[i].id == id)
				return me.itemArray[i];
		}
		return null;
	}
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