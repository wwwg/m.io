class Leaderboard {
    sortPlayers() {
        return this.gameServer.manager.players.sort((a, b) => {
            return a.player.score + b.player.score;
        });
    }
    constructor(gameServer) {
        this.gameServer = gameServer;
    }
}
module.exports = Leaderboard;