var Weapons = require('./Weapons');
class Axe extends Weapons.Weapon {
	constructor() {
		super(1);
		this.setEffect(me => {
			me.weaponCode = 1;
			me.gatherRate = 3;
			me.damage = 5;
			me.xpGain = 9;
		});
	}
}
module.exports = Axe;