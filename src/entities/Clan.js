class Clan {
    removePlayer(player) {
        for (var i = 0; i < this.members.length; ++i) {
            if (this.members[i].player.sid === player.player.sid) {
                this.members[i].player.team = null;
                this.members[i].player.clan = null;
                this.members.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    isPlayerOwner(player) {
        return (player.player.sid === this.owner.player.sid);
    }
    addPlayer(player) {
        if (this.owner === null)
            this.owner = player; // Update clan owner
        player.player.team = this.name;
        player.player.clan = this;
        this.members.push(player);
    }
    serialize() {
        var me = this;
        // Turn the Clan object into a structure the client can use
        return {
            "sid": me.name
        }
    }
    serializeMembers() {
        var ser = [];
        for (var i = 0; i < this.members.length; ++i) {
            ser = ser.concat([this.members[i].player.sid,
                this.members[i].player.name]);
        }
        this.serializedMemberCache = ser;
        return this.serializedMemberCache;
    }
    constructor(name) {
        if (name) {
            this.name = name;
        } else {
            this.name = null;
        }
        this.members = [];
        this.serializedMemberCache = [];
        this.owner = null;
    }
}
module.exports = Clan;