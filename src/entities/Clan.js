class Clan {
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