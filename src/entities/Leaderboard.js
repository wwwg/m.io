const PACKET = require('../utils/packetCodes');
class Leaderboard {
    sortPlayers() {
        this.gameServer.manager.players = this.gameServer.manager.players.sort((a, b) => {
            return a.player.score + b.player.score;
        });
        return this.gameServer.manager.players;
    }
    getTopPlayers() {
        var len = this.gameServer.config.leaderboardCount;
        if (this.gameServer.manager.players.length < this.gameServer.config.leaderboardCount)
            len = this.gameServer.manager.players.length;
        return this.gameServer.manager.players.slice(0, len);
    }
    serializePlayer(p) {
        return [
            p.player.sid,
            p.player.name,
            p.player.score,
        ];
    }
    updateLeaderboard() {
        var me = this;
        var lb = me.getTopPlayers(me.sortPlayers());
        var data = [];
        for (var i = 0; i < lb.length; ++i) {
            if (lb[i].player.alive)
                data = data.concat(me.serializePlayer(lb[i]));
        }
        // Broadcast leaderboard data
        me.gameServer.io.emit(PACKET.LEADERBOAD, data);
    }
    constructor(gameServer) {
        this.gameServer = gameServer;
        var me = this;
        this.clock = setInterval(() => {
            me.updateLeaderboard.call(me);
        }, me.gameServer.config.statUpdateSpeed);
    }
}
module.exports = Leaderboard;