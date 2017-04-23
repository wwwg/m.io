var Weapons = require('./Weapons');
class Sword extends Weapons.Weapon {
	constructor() {
		super(0);
		this.setEffect(() => {
			this.weaponCode = 2;
			this.gatherRate = 2;
			this.damage = 15;
		});
	}
}
module.exports = Sword;