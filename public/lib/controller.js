function Controller (select, start, A, B) {

    var player = null;

    var buttons = {
        button_select: select,
        button_start: start,
        button_a: A,
        button_b: B 
    };

    var buttonStates = {
        button_a: 1, //0 is up , 1 is down.
        button_b: 1 
    }

    function registerJoystick () {
        // TODO
    }

    function registerButtons () {
        
        buttons.button_select.onclick = function () { buttonHandler(Controller.KeyCode.SELECT); }
        buttons.button_start.onclick = function () { buttonHandler(Controller.KeyCode.START); }
        //buttons.button_a.onclick = function () { buttonHandler(Controller.KeyCode.A); }
        //buttons.button_b.onclick = function () { buttonHandler(Controller.KeyCode.B); }
        buttons.button_a.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if(buttonStates.button_a == 0){
                buttonPressHandler(Controller.KeyCode.A);
                buttonStates.button_a = 1;
            }
        }, false);
        buttons.button_a.addEventListener('touchend', function(event) {
            event.preventDefault();
            if(buttonStates.button_a == 1){
                buttonReleaseHandler(Controller.KeyCode.A);
                buttonStates.button_a = 0;
            }
          }, false);
        buttons.button_b.addEventListener('touchstart', function(e) {
            e.preventDefault();
            if(buttonStates.button_a == 0){
                buttonPressHandler(Controller.KeyCode.B);
                buttonStates.button_a = 1;
            }
        }, false);
        buttons.button_b.addEventListener('touchend', function(event) {
            event.preventDefault();
            if(buttonStates.button_a == 1){
                buttonReleaseHandler(Controller.KeyCode.B);
                buttonStates.button_a = 0;
            }
        }, false);
    }

    function buttonHandler (controllerKeyCode) {
        if (player && player.isConnected() && controllerKeyCode) {
            player.sendCommand(controllerKeyCode, false);
            setTimeout(function(){ player.sendCommand(controllerKeyCode, true);}, 100);
        }
    }

    function buttonPressHandler (controllerKeyCode) {
        if (player && player.isConnected() && controllerKeyCode) {
            player.sendCommand(controllerKeyCode, false);
        }
    }

    function buttonReleaseHandler (controllerKeyCode) {
        if (player && player.isConnected() && controllerKeyCode) {
            player.sendCommand(controllerKeyCode, true);
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