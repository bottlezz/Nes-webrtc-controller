var view_check=document.getElementById('view_OrientationCheck');
var socketSupport=document.getElementById("SupportFailMessage");
var mql = window.matchMedia("(orientation: portrait)");

mql.addListener(function(m) {
	orientationChange();
});
var player = null;
function initialize() {
	player = new Player(1);
	player.init();
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
	getButton(currentRot);
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

function getButton(rot)
{
    //top down left right
    function updateAndSend(direction){
        var directionChange = getPressAndRelease(direction,currentDirection);
        currentDirection=direction;
        handlePress(directionChange.press, player.sendCommand);
        handleRelease(directionChange.release, player.sendCommand);
		
    }
    if((rot<=-30 && rot>=-27) || (rot>=27 && rot <=30)){
        //up
        updateAndSend([1,0,0,0]);
    }else if(rot>=19 && rot <=26){
        //up right
        updateAndSend([1,0,0,1]);
    }else if(rot>= 12 && rot <=18){
        //right
        updateAndSend([0,0,0,1]);
    }else if(rot>= 4 && rot<=11){
        //right down
        updateAndSend([0,1,0,1]);
    }else if((rot>=-3 && rot<=3)){
        //down
        updateAndSend([0,1,0,0]);
    }else if((rot<=-4 && rot>=-11)){
        //left down;
        updateAndSend([0,1,1,0]);
    }else if(rot<=-12&& rot>=-18){
        //left
        updateAndSend([0,0,1,0]);
    }else if(rot<=-19 && rot>=-26){
        // left up
        updateAndSend([1,0,1,0]);
    }else{
        releaseAll(player.sendCommand);
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
            release[i] = 0;
        }
    }
    return {press, release};
}

function handlePress(direction, callBack){
    //top down left right

    if(direction[0]){
        callBack(Controller.KeyCode.UP, false);
        console.log(direction);
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
        console.log(direction);
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
    callBack(Controller.KeyCode.RIGHT, true);
    callBack(Controller.KeyCode.LEFT, true);
    callBack(Controller.KeyCode.DOWN, true);
    callBack(Controller.KeyCode.UP,true);
}

$(".start").click(function(){
    player.sendCommand(Controller.KeyCode.START, false);
    setTimeout(function(){ player.sendCommand(Controller.KeyCode.START, true);}, 100);

})