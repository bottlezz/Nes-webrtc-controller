function Player (id) {

    var id = id;
    var lastPeerId = null;
    var peer = null; // own peer object
    var conn = null;

    function initialize() {
        // Create own peer object with connection to shared PeerJS server
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
            console.log('ID: ' + peer.id);
        });
        peer.on('disconnected', function () {
            status.innerHTML = "Connection lost. Please reconnect";
            console.log('Connection lost. Please reconnect');
            // Workaround for peer.reconnect deleting previous id
            peer.id = lastPeerId;
            peer._lastServerId = lastPeerId;
            peer.reconnect();
        });
        peer.on('close', function() {
            conn = null;
            status.innerHTML = "Connection destroyed. Please refresh";
            console.log('Connection destroyed');
        });
        peer.on('error', function (err) {
            console.log(err);
            alert('' + err);
        });
    };
    /**
     * Create the connection between the two Peers.
     *
     * Sets up callbacks that handle any events related to the
     * connection and data received on it.
     */
    function join(connectionId) {
        // Close old connection
        if (conn) {
            conn.close();
        }
        // Create connection to destination peer specified in the input field
        conn = peer.connect(connectionId, {
            reliable: true
        });
        conn.on('open', function () {
            log("Connected");
            // Check URL params for comamnds that should be sent immediately
            var command = getUrlParam("command");
            if (command)
                conn.send(command);
        });
        // Handle incoming data (messages only since this is the signal sender)
        conn.on('data', function (data) {
            // addMessage("<span class=\"peerMsg\">Peer:</span> " + data);
        });
        conn.on('close', function () {
            log("Disconnected");
        });
    };
    
    function isConnected() {
        return (conn && conn.open);
    }

    function getUrlParam(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null)
            return null;
        else
            return results[1];
    };

    function controllerSignal(controllerCode, isPressed) {
        if (conn.open) {
            // create message
            var data = {
                playerId: id,
                controllerCode: controllerCode,
                isPressed: isPressed
            }
            conn.send(data);
            log("Message Sent");
            console.log(data);
        }
    }
    
    function log(msg) {
        console.log(conn.peer + ": " + msg);
    }

    return {
        init: initialize,
        join: join,
        sendCommand: controllerSignal,
        isConnected: isConnected
    }
};