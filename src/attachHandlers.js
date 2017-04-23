var MessageHandler = require('./managers/MessageHandler');
var Player = require('./entities/Player');
var log = require('./utils/Logger');
var Manager = require('./managers/PlayerManager');
var Leaderboard = require('./entities/Leaderboard');
var Utils = require('./utils/Utils');
var ClanManager = require('./managers/ClanManager');
var Minimap = require("./managers/MinimapManager");
var GameObjManager = require('./managers/GameObjManager');
var PhysicsEngine = require('./utils/PhysicsEngine');
var Store = require('./managers/Store');
const PACKET = require('./utils/packetCodes');

module.exports = (me, socket) => {
	log.all('New connection accepted.');
	me.manager.add(socket);
	me.msgHandler.conn.call(me, socket);
	// Attach packet handlers
	socket.on(PACKET.PLAYER_START, data => {
		// Player spawn packet, the data is an object with one property
		return me.msgHandler.spawn.call(me, socket, data);
	});
	socket.on(PACKET.PLAYER_ANGLE, data => {
		return me.msgHandler.angle.call(me, socket, data);
	});
	socket.on(PACKET.PLAYER_MOVE, (key, down) => {
		return me.msgHandler.move.call(me, socket, key, down);
	});
	socket.on(PACKET.CHAT, msg => {
		return me.msgHandler.chat.call(me, socket, msg);
	});
	socket.on(PACKET.CLAN_CREATE, clanName => {
		return me.msgHandler.clanCreate.call(me, socket, clanName);
	});
	socket.on(PACKET.PLAYER_LEAVE_CLAN, () => {
		return me.msgHandler.clanLeave.call(me, socket);
	})
	socket.on(PACKET.CLAN_REQ_JOIN, sid => {
		return me.msgHandler.clanJoin.call(me, socket, sid);
	});
	socket.on(PACKET.CLAN_ACC_JOIN, (sid, join) => {
		return me.msgHandler.notificationResponse.call(me, socket, sid, join);
	});
	socket.on(PACKET.CLAN_KICK, sid => {
		return me.msgHandler.clanKick.call(me, socket, sid);
	});
	socket.on(PACKET.AUTO_ATK, () => {
		return me.msgHandler.autoAttack.call(me, socket);
	});
	socket.on(PACKET.PLAYER_ATTACK, (atk, buildDir) => {
		return me.msgHandler.attack.call(me, socket, atk, buildDir);
	});
	socket.on(PACKET.ITEM_BUY, (isBuying, id) => {
		return me.msgHandler.attemptBuy.call(me, socket, isBuying, id);
	});
	socket.on(PACKET.PLAYER_UPGRADE, id => {
		return me.msgHandler.doUpgrade.call(me, socket, id);
	});
	socket.on('disconnect', () => {
		return me.msgHandler.disconn.call(me, socket);
	});
}