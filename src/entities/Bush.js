var GameObj = require('./GameObject');

class Bush extends GameObj {
	constructor(sid) {
		super(sid);
		this.type = 1;
		this.scale = 90;
	}
}
module.exports = Bush;