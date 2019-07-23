var view_check=document.getElementById('view_OrientationCheck');
var socketSupport=document.getElementById("SupportFailMessage");
var mql = window.matchMedia("(orientation: portrait)");

mql.addListener(function(m) {
	orientationChange();
});
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
function initialize() {
    var params = getUrlParams();
    var playerNumber = 1;
    try {
        playerNumber = parseInt(params.player);
    } catch {
        playerNumber = 1;
    }

	player = new Player(playerNumber);
    player.init();
    controller = new Controller($(".select")[0], $(".start")[0], $(".buttonA")[0], $(".buttonB")[0]);
    controller.assign(player);
    var pid = getPeerId();
    if( pid){
        player.join(pid);
    }
};
initialize();

initControllers();
orientationChange();
/*
if (window.MozWebSocket) {
    console.log('using MozillaWebSocket');
    window.WebSocket = window.MozWebSocket;
} else if (!window.WebSocket) {
   	socketSupport.style.display = "block";
    //alert('browser does not support websockets!');
    
}
*/
var windowWidth=$(window).width()>$(window).height()?$(window).width():$(window).height();
var windowHeight=$(window).width()<$(window).height()?$(window).width():$(window).height()
$("#controlPannel").width(windowWidth);
$("#controlPannel").height(windowHeight-20);
var cPad1;
var cPad2;

function initControllers(){
	cPad1= new ControlPad("ctrl1", touchOnCallBack, touchUpCallBack, handlePress, handleRelease);
}

$("#join").click(join);
function join() {
    var pid=$("#recvId").val();
    console.log(pid);
    player.join(pid);
}

function touchOnCallBack(x,y){

}
function touchUpCallBack(x,y){	
    releaseAll();
}

function orientationChange(){
	var mql = window.matchMedia("(orientation: portrait)");
	if(mql.matches) {
		// Portrait orientation
		view_check.style.display = "block";
	} else {
		// Landscape orientation
		view_check.style.display = "none";
		initControllers();
	}
};

function getPressAndRelease(newDirection, currentDirection) {
    var press = [0,0,0,0];
    var release = [0,0,0,0];
    for(let i = 0; i < 4 ; i++){
        if(newDirection[i]==1 && currentDirection[i]==0){
            press[i] = 1;
        }
        if(newDirection[i]==0 && currentDirection[i]==1){
            release[i] = 1;
        }
    }
    return {press, release};
}

function handlePress(direction){
    //top down left right

    callBack= player.sendCommand;
    callBack= function(a,b) {console.log(a + " " + b);}

    if(direction[0]){
        callBack(Controller.KeyCode.UP, false);
        //console.log(direction);
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
    //top down left right

    callBack= player.sendCommand;
    callBack= function(a,b) {console.log(a + " " + b);}
    if(direction[0]){
        callBack(Controller.KeyCode.UP,true);
        //console.log(direction);
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
    callBack= function(a,b) {console.log(a + " " + b);}
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
