var Weapons = require('./Weapons');
class Sword extends Weapons.Weapon {
	constructor() {
		super(0);
		this.setEffect(me => {
			me.weaponCode = 2;
			me.gatherRate = 1;
			me.damage = 15;
			me.xpGain = 5;
			me.items[0] = 2;
		});
	}
}
module.exports = Sword;