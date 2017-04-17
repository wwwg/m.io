(() => {
    // Set to null to connect to regular game servers
    window.overrideIP = '127.0.0.1:5000';
    // window.overrideIP = null;
    let log = console.debug; // Can change to console.log if needed
    console.clear();
    if (localStorage['load_local_script']) {
        log('Local script loaded');
    }
    let init = () => {
        // The Socket.io script tag has loaded
        window.ioconn = window.io.connect;
        
        window.io.connect = function() { // The moomoo.io game client uses io.connect to establish a socket.io connection
            if (window.overrideIP) {
                arguments[0] = window.overrideIP;
            }
            if (!arguments[1] || !arguments[1]["query"]) {
                // The client always makes a connection with a query string, and this connection doesn't supply one.
                return ioconn.apply(this, arguments);
            } else {
                // The game client is attempting to connect to the Socket.io server
                var s = ioconn.apply(this, arguments);
                var socketEmit = s.emit;
                
                // Capture outgoing traffic
                s.emit = function() {
                    var packetType = arguments[0];
                    var mainData = arguments[1];
                    // There are also other arguments that are supplied based on the packet being sent...
                    
                    switch (packetType) {
                        case "1":
                            // Spawn packet
                            log("Player spawn detected. name:", mainData.name);
                            break;
                        case "2":
                            // Angle packet
                            // Commented out because of spam
                            // log("Ange update", mainData);
                            break;
                        case "connect":
                            log('Connection handshake sent.');
                            break;
                        case "ping":
                            log('Ping!');
                            break;
                        case "pong":
                            log('Pong!');
                            break;
                        case "3":
                            var move = "";
                            switch(mainData) {
                                case "u":
                                    move = "Up";
                                    break;
                                case "d":
                                    move = "Down";
                                    break;
                                case "l":
                                    move = "Left";
                                    break;
                                case "r":
                                    move = "Right";
                                    break;
                            }
                            log('Move direction:', move, "isMoving:", !!arguments[2]);
                            break;
                        case "7":
                            log('Auto attack toggled');
                            break;
                        case "4":
                            log('Attacking:', !!mainData);
                            break;
                        case "rk":
                            log('Key reset');
                            break;
                        default:
                            log("Unknown outgoing packet with args", arguments);
                            break;
                    }
                    return socketEmit.apply(this, arguments); // Call the real emit
                }
                
                // Capture incoming traffic
                s.on('ch', (sid, msg) => {
                    // Chat message
                    log('Player with sid', sid, 'send message:', msg);
                });
                s.on('1', mySid => {
                    console.log('I recieved my SID:', mySid);
                });
                s.on('2', (data, isYou) => {
                    console.log('Add player', data, 'isYou', isYou);
                });
                s.on("connect_error", err => {
                    console.error(err);
                    alert("Server connection error:\n" + err.toString());
                });
                s.on('3', data => {
                    // Player update
                    console.log("Raw player update info:", data);
                });
                // TODO: capture more incoming traffic

                return s;
            }
        }
    }
    window.addEventListener('load', init);
})();