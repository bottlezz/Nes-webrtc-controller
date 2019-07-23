
function Host (openCallback, readyCallback) {

    var peer = null;
    var lastPeerId = null;
    var connections = {};
    var onOpenCallback = openCallback;
    var onReadyCallback = readyCallback;

    function init() {

        peer = new Peer(null, {
            debug: 2
        });

        peer.on('open', function (id) {
            // Workaround for peer.reconnect deleting previous id
            if (peer.id === null) {
                    console.log('Received null id from peer open');
                    peer.id = lastPeerId;
                } else {
                    lastPeerId = peer.id;
                }
            if (onOpenCallback instanceof Function) {
                onOpenCallback(peer.id);
            }
        });
        peer.on('disconnected', function () {
            console.log('Connection lost. Please reconnect');
            if (peer && !peer.destroyed) {
                // Workaround for peer.reconnect deleting previous id
                peer.id = lastPeerId;
                peer._lastServerId = lastPeerId;
                peer.reconnect();
            } 
        });
        peer.on('connection', function (c) {
            if (connections[c.peer]) {
                return;
            }
            connections[c.peer] = {player: c.options.metadata.playerIndex, connection: c};
            console.log("Connected to: " + c.peer);
            if (onReadyCallback instanceof Function) {
                onReadyCallback(c);
            }
        });
        peer.on('close', function() {
            for(var connId in connections) {
                var conn = connections[connId].connection;
                if (conn.open) {
                    conn.destroy();
                }
            }
            connections = {};
            console.log('Connection destroyed');
        });
        peer.on('error', function (err) {
            console.log(err);
        });
    }

    function refresh() {
        if (peer && peer.open) {
            peer.destroy();
            setTimeout( function() { init(); }, 1000);
        }
    }

    return {
        start: init,
        refresh: refresh
    };
};