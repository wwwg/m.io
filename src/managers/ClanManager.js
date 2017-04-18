var Clan = require("../entities/Clan");

class ClanManager {
    connstructor(gameServer) {
        this.gameServer = gameServer;
        this.clans = [];
    }
}
module.exports = ClanManager;