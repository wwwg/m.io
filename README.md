# The m.io project
The goal of the m.io project is to create an open source Moomoo.io server implementation. m.io is only partially finished, and currently contains limited features compared to the actual game.

# What does m.io currently support?
Here is a list of the features implemented in m.io, please note that the project is currently work in progress.
- Player managment: ✓
- Customizability: ✓
- Internal game clock: ✓
- Clans: ✓
- Configurable player limit: ✓
- Leaderboard: ✓
- Minimap: ✓
- Chat: ✓
- Day / night cycle: Partial support
- Game Objects: Partial support
- Robust physics engine: ✘
- PvP: ✘
- Shop: ✘
- Items: ✘
- Projectile Physics: ✘
<br>
Everything marked as an X is a planned feature. Other unique features are planned such as multi world servers and game modes.

# Running the server
Because m.io is in development, ther are no current scripts to ease installation and deplyment of an m.io server. Here are manual instructions on *nix:
**PLEASE NOTE that running m.io requires node.js 6.0 or higher***
```sh
git clone https://github.com/wwwwwwwwwwwwwwwwwwwwwwwwwwwwww/m.io.git;
cd m.io;
npm install;
npm run test; # Will start the server on port 5000
```

# Directory roadmap
`src/` - The server source code<br>
`tests/` - Test scripts<br>
`packetAnalyzer` - A userscript that is able to capture and log traffic between the Moomoo.io server and client
