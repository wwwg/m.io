var Weapons = require('./Weapons');
class Axe extends Weapons.Weapon {
	constructor() {
		super(0);
		this.setEffect(() => {
			this.weaponCode = 1;
			this.gatherRate = 6;
			this.damage = 5;
		});
	}
}
module.exports = Axe;