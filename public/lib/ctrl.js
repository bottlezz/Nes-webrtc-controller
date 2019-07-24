


var player = null;
var controller = null;

function getUrlParams () {
    var params = {};
    var tmp = [];
    window.location.search.substr(1).split("&").forEach(function (item) {
        tmp = item.split("=");
        if (tmp.length > 1) {
            params[tmp[0]] = decodeURIComponent(tmp[1]);
        }
    });;
    return params;
}

function joinGame(pid, player) {
    console.log(pid);
    player.join(pid, function() {
        $("#status").text("Connected");
    }, function() {
        $("#status").text("Disconnected");
    });
}


function initialize() {
    var params = getUrlParams();
    var playerNumber = 1;
    var peerId = undefined;

    try {
        playerNumber = parseInt(params.player);
    } catch {
        playerNumber = 1;
    }

    if(params){
        peerId = params.peerid;
    }

    var windowWidth=$(window).width()>$(window).height()?$(window).width():$(window).height();
    var windowHeight=$(window).width()<$(window).height()?$(window).width():$(window).height()
    $("#controlPannel").width(windowWidth);
    $("#controlPannel").height(windowHeight-20);
    $("#join").click(
        function () {
            var pid=$("#recvId").val();
            joinGame(pid, player);
            console.log(pid);
        }
    );

	player = new Player(playerNumber);
    player.init();
    joyStick = new JoyStick("joyStick", function(){}, releaseAll, handlePress, handleRelease);
    controller = new Controller($(".select")[0], $(".start")[0], $(".buttonA")[0], $(".buttonB")[0]);
    controller.assign(player);

    if(peerId){
        joinGame(peerId, player);
    }
};

$(document).ready(function(){
    var mql = window.matchMedia("(orientation: portrait)");
    var view_check=document.getElementById('view_OrientationCheck');

    if(mql.matches) {
		// Portrait orientation
        view_check.style.display = "block";
        mql.addListener(function(m) {
            orientationChange();
        });

        return;
	} else {
		// Landscape orientation
		view_check.style.display = "none";
	}
    initialize();
})

function orientationChange(){
	var mql = window.matchMedia("(orientation: portrait)");
	if(mql.matches) {
		// Portrait orientation
		view_check.style.display = "block";
	} else {
		location.reload();
	}
};

function handlePress(direction){
    //direction = [top, down, left, right]
    callBack= player.sendCommand;
    //callBack= function(a,b) {console.log(a + " " + b);}

    if(direction[0]){
        callBack(Controller.KeyCode.UP, false);
    }
    if(direction[1]){
		callBack(Controller.KeyCode.DOWN, false);
    }
    if(direction[2]){
		callBack(Controller.KeyCode.LEFT, false);
    }
    if(direction[3]){
		callBack(Controller.KeyCode.RIGHT, false);
    }
}

function handleRelease(direction){
    //direction = [top, down, left, right]
    callBack= player.sendCommand;
    //callBack= function(a,b) {console.log(a + " " + b);}
    if(direction[0]){
        callBack(Controller.KeyCode.UP,true);
    }
    if(direction[1]){
		callBack(Controller.KeyCode.DOWN, true);
    }
    if(direction[2]){
		callBack(Controller.KeyCode.LEFT, true);
    }
    if(direction[3]){
		callBack(Controller.KeyCode.RIGHT, true);
    }
}

function releaseAll()
{
    callBack= player.sendCommand;
    //callBack= function(a,b) {console.log(a + " " + b);}
    callBack(Controller.KeyCode.RELEASE, true);
}

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function getPeerId(){
    return getUrlVars()["peerId"];
}
