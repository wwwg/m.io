class Weapon {
	setEffect(effect) {
		// The effect is called witihin the context of the player
		this.effect = effect;
	}
	constructor(id) {
		this.id = id;
		this.effect = me => {
			throw new Error('Weapon effect not set.');
		}
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