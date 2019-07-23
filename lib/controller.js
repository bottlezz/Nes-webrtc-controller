function Controller (select, start, A, B) {

    var player = null;

    var buttons = {
        button_select: select,
        button_start: start,
        button_a: A,
        button_b: B 
    };

    function registerJoystick () {
        // TODO
    }

    function registerButtons () {
        buttons.button_select.onclick = function () { buttonHandler(Controller.KeyCode.SELECT); }
        buttons.button_start.onclick = function () { buttonHandler(Controller.KeyCode.START); }
        buttons.button_a.onclick = function () { buttonHandler(Controller.KeyCode.A); }
        buttons.button_b.onclick = function () { buttonHandler(Controller.KeyCode.B); }
    }

    function buttonHandler (controllerKeyCode) {
        if (player && player.isConnected() && controllerKeyCode) {
            player.sendCommand(controllerKeyCode, false);
            setTimeout(function(){ player.sendCommand(controllerKeyCode, true);}, 100);
        }
    }

    function assignToPlayer(newPlayer) {
        if (!player) {
            player = newPlayer;
            registerButtons();
            registerJoystick();
        }
    }

    return {
        assign: assignToPlayer
    }
};

Controller.KeyCode = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
    A: 5,
    B: 6,
    SELECT: 7,
    START: 8,
    RELEASE: 9
}