class Clan {
    removePlayer(player) {
        for (var i = 0; i < this.members.length; ++i) {
            if (this.members[i].player.sid === player.player.sid) {
                this.members[i].player.team = null;
                this.members.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    addPlayer(player) {
        player.player.team = this.name;
        this.members.push(player);
    }
    constructor(name) {
        if (name) {
            this.name = name;
        } else {
            this.name = null;
        }
        this.members = [];
    }
}
module.exports = Clan;