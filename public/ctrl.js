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
var lastRot=360;
var currentRot=0;
var lastRotUpdate=0;//for checking if anychanges in the interval

//var service=new ClientService();

//service.init();
//var connect=new GameCenter();
//var guid=getGuid();
var fired=false;
var ctrlStatus=0;
var ctrlPadDeltaX=$(".buttonBase").width()/2;
var ctrlPadDeltaY=$(".ctrlPadl").height()-$(".buttonBase").width()/2;
var analogStickWidth=$(".ctrlPadl").width()*0.3;
var analogStickRangeRadius=$(".ctrlPadl").width()*0.15;

var currentDirection =[0,0,0,0]// css order, up down left right;

function initControllers(){
	cPad1= new ControlPad("ctrl1",touchOnCallBack, touchUpCallBack);
	//cPad2= new TouchPad("ctrl2",bulletFire);
}

var cw = $('.buttonBase').width();
$('.buttonBase').css({'height':cw+'px'});

var cw = $('#analogStick').width();
$('#analogStick').css({'height':cw+'px'});
resetAnalogStickPosition();
var stopCheck;
function bulletFire(){
	if(!fired){
		fired = true;
		//connect.broadcast({action:"fireUp",guid:guid,rot:currentRot});
		//service.sendBulletFire(currentRot);
		setTimeout(function(){
			fired=false;
		},600)
	}
}

$("#join").click(join);
function join() {
    var pid=$("#recvId").val();
    console.log(pid);
    player.join(pid);
}

function touchOnCallBack(x,y){
	
	var rot=getRot(x,y,ctrlPadDeltaX,ctrlPadDeltaY);
	currentRot=rot;
	if(ctrlStatus==0){
		//service.sendMoveStart(currentRot);
		lastRotUpdate=currentRot;
	}
	ctrlStatus=1;
	updateAnalogStickPosition(currentRot);
	getButton(currentRot);
}
function touchUpCallBack(x,y){
	ctrlStatus=2;
    //getButton(currentRot);
    releaseAll(player.sendCommand);
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

function updateAnalogStickPosition(r){
	$('#analogStick').offset({
		left:ctrlPadDeltaX- analogStickWidth/2 +Math.sin(Math.PI*r/30)*analogStickRangeRadius, 
		top:ctrlPadDeltaY- analogStickWidth/2+Math.cos(Math.PI*r/30)*analogStickRangeRadius
	});
}
function resetAnalogStickPosition(){
	$('#analogStick').offset({left:ctrlPadDeltaX- analogStickWidth/2, top:ctrlPadDeltaY- analogStickWidth/2});
	//$('#analogStick').top();
}


/*
*/
var go=setInterval(function(){
	switch(ctrlStatus){
		case 0:
		break;
		case 1:
		if(Math.abs(lastRot-currentRot)<1)
		{
			if (currentRot!=lastRotUpdate) {
				
				//service.sendMoveStart(currentRot);
				lastRotUpdate=currentRot;
				
			};
		}
		lastRot=currentRot;
		break;
		case 2:
		resetAnalogStickPosition();
		//connect.broadcast({action:"keyUp",guid:guid,rot:lastRot});
		//service.sendMoveStop(lastRot);
		lastRot=360;
		lastRotUpdate=360;
		ctrlStatus=0;
		break;
	}
},20);

var directionList=[
    [1,0,0,0],
    [1,0,0,1],
    [0,0,0,1],
    [0,1,0,1],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,1,0],
    [1,0,1,0]
]
function getButton(rot)
{
    //top down left right
    function updateAndSend(direction){
        var directionChange = getPressAndRelease(direction,currentDirection);
        currentDirection=direction;
        handlePress(directionChange.press, player.sendCommand);
        handleRelease(directionChange.release, player.sendCommand);
		
    }
    //console.log(rot);
    if((rot<=-30 && rot>=-27) || (rot>=27 && rot <=30) && currentDirection!=directionList[0]){
        //up

        console.log("up");
        updateAndSend(directionList[0]);
    }else if(rot>=19 && rot <=26 && currentDirection!=directionList[1]){
        //up right
        updateAndSend(directionList[1]);
        console.log("up right");

    }else if(rot>= 12 && rot <=18 && currentDirection!=directionList[2]){
        //right
        updateAndSend(directionList[2]);
        console.log("right");

    }else if(rot>= 4 && rot<=11 && currentDirection!=directionList[3]){
        //right down
        updateAndSend(directionList[3]);
        console.log("right down");

    }else if((rot>=-3 && rot<=3) && currentDirection!=directionList[4]){
        //down
        
        updateAndSend(directionList[4]);
        console.log("down");

    }else if((rot<=-4 && rot>=-11) && currentDirection!=directionList[5]){
        //left down;
        updateAndSend(directionList[5]);
        console.log("left down");

    }else if(rot<=-12&& rot>=-18 && currentDirection!=directionList[6]){
        //left
        updateAndSend(directionList[6]);
        console.log("left");

    }else if(rot<=-19 && rot>=-26 && currentDirection!=directionList[7]){
        // left up
        updateAndSend(directionList[7]);
        console.log("left up");

    }else{
        //releaseAll(player.sendCommand);
    }
}

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

function handlePress(direction, callBack){
    //top down left right

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

function handleRelease(direction, callBack){
    //top down left right

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

function releaseAll(callBack)
{
    callBack(Controller.KeyCode.RELEASE, true);
    currentDirection=[0,0,0,0];
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
