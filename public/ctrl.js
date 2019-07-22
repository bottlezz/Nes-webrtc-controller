var view_check=document.getElementById('view_OrientationCheck');
var socketSupport=document.getElementById("SupportFailMessage");
var mql = window.matchMedia("(orientation: portrait)");

mql.addListener(function(m) {
	orientationChange();
});

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

var directions =[0,0,0,0]// css order, up down left right;

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

function touchOnCallBack(x,y){
	
	var rot=getRot(x,y,ctrlPadDeltaX,ctrlPadDeltaY);
	currentRot=rot;
	if(ctrlStatus==0){
		//service.sendMoveStart(currentRot);
		lastRotUpdate=currentRot;
	}
	ctrlStatus=1;
	updateAnalogStickPosition(currentRot);
}
function touchUpCallBack(x,y){
    console.log(currentRot);
	ctrlStatus=2;
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
    
    if((rot<=-30 && rot>=-27) || (rot>=27 && rot <=30)){
        //up
        
    }else if(rot>=19 && rot <=26){
        //up right
    }else if(rot>= 12 && rot <=18){
        //right
    }else if(rot>= 4 && rot<=11){
        //right down
    }else if((rot>=-3 && rot<=3)){
        //down
    }else if((rot<=-4 && rot>=-11)){
        //left down
    }else if(rot<=-12&& rot>=-18){
        //left
    }else if(rot<=-19 && rot>=-26){
        // left up
    }
}

getPressAndRelease(newDirection, currentDirection){
    var press = [0,0,0,0];
    var relese = [0,0,0,0];
    for(let i = 0; i < 4 ; i++){
        if(newDirection[i]==1 && currentDirection[i]==0){
            press[i] = 1;
        }
        if(newDirection[i]==0 && currentDirection[i]==1){
            release[i] = 0;
        }
    }
    return {press, relese};
}