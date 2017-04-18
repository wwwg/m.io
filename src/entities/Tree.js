var GameObj = require('./GameObject');

class Tree extends GameObj {
	constructor(sid) {
		super(sid);
		this.type = 0;
		this.scale = 140;
	}
}
module.exports = Tree;