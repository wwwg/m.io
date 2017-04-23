var Weapons = require('./Weapons');
class Hammer extends Weapons.Weapon {
	constructor() {
		super(0);
		this.setEffect(me => {
			me.weaponCode = 0;
			me.gatherRate = 2;
			me.damage = 5;
		});
	}
}
module.exports = Hammer;