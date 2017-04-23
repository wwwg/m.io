var Weapons = require('./Weapons');
class Hammer extends Weapons.Weapon {
	constructor() {
		super(0);
		this.setEffect(me => {
			me.weaponCode = 0;
			me.gatherRate = 1;
			me.damage = 5;
			me.xpGain = 4;
		});
	}
}
module.exports = Hammer;