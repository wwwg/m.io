class Weapon {
	constructor() {
		//
	}
}
class WeaponManager {
	constructor(serv) {
		this.serv = serv;
	}
}
module.exports = {
	Weapon: Weapon,
	WeaponManager: WeaponManager
}