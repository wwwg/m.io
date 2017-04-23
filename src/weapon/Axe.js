var Weapons = require('./Weapons');
class Axe extends Weapons.Weapon {
	constructor() {
		super(1);
		this.setEffect(me => {
			me.weaponCode = 1;
			me.gatherRate = 6;
			me.damage = 5;
		});
	}
}
module.exports = Axe;