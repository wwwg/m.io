var GameObj = require('./GameObject');

class Stone extends GameObj {
	constructor(sid) {
		super(sid);
		this.type = 2;
		this.scale = 90;
	}
}
module.exports = Stone;