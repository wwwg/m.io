const PACKET = require('../utils/packetCodes');
class MinimapManager {
    minimapTick() {
        var me = this;
        me.serv.io.emit(PACKET.MINIMAP, 0);
        var players = me.serv.manager.players;
        for (var i = 0; i < players.length; ++i) {
            if (players[i].player.clan) {
                var mems = players[i].player.clan.members;
                var data = [];
                for (var j = 0; j < mems.length; ++j) {
                    data.push(mems[j].player.x);
                    data.push(mems[j].player.y);
                }
                players[i].emit(PACKET.MINIMAP, data);
            }
        }
    }
    constructor(gameServer) {
        this.serv = gameServer;
        var me = this;
        this.clock = setInterval(() => {
            me.minimapTick.call(me);
        }, me.serv.config.minimapSpeed);
    }
}
module.exports = MinimapManager;