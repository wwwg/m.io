var Weapons = require('./Weapons');
class Hammer extends Weapons.Weapon {
	constructor() {
		super(0);
		this.setEffect(() => {
			this.weaponCode = 0;
			this.gatherRate = 2;
			this.damage = 5;
		});
	}
}
module.exports = Hammer;