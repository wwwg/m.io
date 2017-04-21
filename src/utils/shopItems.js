class ShopItem {
	constructor(id, price) {
		this.id = id;
		this.price = price;
	}
}
var shopItems = {
	bummleHat: new ShopItem(8, 100),
	strawHat: new ShopItem(2, 500),
	winterCap: new ShopItem(15, 1000),
	cowboyHat: new ShopItem(5, 1000),
	rangerHat: new ShopItem(4, 2000),
	explorerHat: new ShopItem(18, 2000),
	marksmanCap: new ShopItem(1, 3000),
	soldierHelm: new ShopItem(6, 5000),
	honeycrisp: new ShopItem(13, 5000),
	minerHelm: new ShopItem(9, 5000),
	boostHat: new ShopItem(12, 6000),
	bushGear: new ShopItem(10, 10000),
	spikeGear: new ShopItem(11, 10000),
	bushido: new ShopItem(16, 15000),
	samurai: new ShopItem(20, 15000)
}
module.exports = {
	ShopItem: ShopItem,
	items: shopItems
}