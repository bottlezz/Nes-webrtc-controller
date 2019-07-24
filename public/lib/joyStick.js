function JoyStick(id,touchStartcallBack,touchEndCallBack, handlePress, handleRelease)
{
  var pad=document.getElementById(id);
  var padCord=getPosition(pad);
  this.x=-1;
  this.y=-1;
  this.rot=-1;
  var self=this;

  var ctrlStatus=0;
  var ctrlPadDeltaX=$(".buttonBase").width()/2;
  var ctrlPadDeltaY=$(".buttonBase").width()/2;
  var analogStickWidth=$(".buttonBase").width()*0.3;
  var analogStickRangeRadius=$(".buttonBase").width()*0.20;
  var lastRot=360;
  var currentRot=0;
  var lastRotUpdate=0;//for checking if anychanges in the interval
  var currentDirection =[0,0,0,0]// css order, up down left right;
  var directionList=[
    [1,0,0,0],
    [1,0,0,1],
    [0,0,0,1],
    [0,1,0,1],
    [0,1,0,0],
    [0,1,1,0],
    [0,0,1,0],
    [1,0,1,0]
  ];
  
  var cw = $('.buttonBase').width();
  $('.buttonBase').css({'height':cw+'px'});
  
  var cw = $('#analogStick').width();
  $('#analogStick').css({'height':cw+'px'});
  resetAnalogStickPosition();
  
  pad.addEventListener('touchmove', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    updateStatus();
    trackButton(handlePress,handleRelease);
    touchStartcallBack(self.x,self.y);

  }, false);

  pad.addEventListener('touchstart', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    updateStatus();
    trackButton(handlePress,handleRelease);
    touchStartcallBack(self.x,self.y);
  }, false);

  pad.addEventListener('touchend', function(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    currentDirection=[0,0,0,0];
    ctrlStatus=2;
    touchEndCallBack(self.x,self.y);
  }, false);
  
  function updateStatus(){
    var touch = event.targetTouches[0];
    self.x = touch.pageX -padCord.x;
    self.y = touch.pageY -padCord.y;
    var rot=getRot(self.x,self.y,ctrlPadDeltaX,ctrlPadDeltaY);
    currentRot=rot;
    if(ctrlStatus==0){
      lastRotUpdate=currentRot;
    }
    ctrlStatus=1;
    updateAnalogStickPosition(currentRot);
  }

  function updateAnalogStickPosition(r){
    $('#analogStick').offset({
      left:ctrlPadDeltaX- analogStickWidth/2 +Math.sin(Math.PI*r/30)*analogStickRangeRadius, 
      top:ctrlPadDeltaY- analogStickWidth/2+Math.cos(Math.PI*r/30)*analogStickRangeRadius
    });
  }
  function resetAnalogStickPosition(){
    $('#analogStick').offset({left:ctrlPadDeltaX- analogStickWidth/2, top:ctrlPadDeltaY- analogStickWidth/2});
  }

  //Tracks touch event and trigger callbacks
  function trackButton(handlePress, handleRelease)
  {
    //top down left right
    function updateAndSend(direction){
        var directionChange = getPressAndRelease(direction,currentDirection);
        currentDirection=direction;
        handlePress(directionChange.press);
        handleRelease(directionChange.release);	
    }
    let rot = currentRot;
    if((rot<=-30 && rot>=-26) || (rot>=26 && rot <=30) && currentDirection!=directionList[0]){
        //up
        //console.log("up");
        updateAndSend(directionList[0]);
    }else if(rot>=20 && rot <=25 && currentDirection!=directionList[1]){
        //up right
        updateAndSend(directionList[1]);
        //console.log("up right");

    }else if(rot>= 11 && rot <=19 && currentDirection!=directionList[2]){
        //right
        updateAndSend(directionList[2]);
       // console.log("right");

    }else if(rot>= 5 && rot<=10 && currentDirection!=directionList[3]){
        //right down
        updateAndSend(directionList[3]);
        //console.log("right down");

    }else if((rot>=-4 && rot<=4) && currentDirection!=directionList[4]){
        //down
        
        updateAndSend(directionList[4]);
        //console.log("down");

    }else if((rot<=-4 && rot>=-10) && currentDirection!=directionList[5]){
        //left down;
        updateAndSend(directionList[5]);
        //console.log("left down");

    }else if(rot<=-11&& rot>=-19 && currentDirection!=directionList[6]){
        //left
        updateAndSend(directionList[6]);
        //console.log("left");

    }else if(rot<=-20 && rot>=-25 && currentDirection!=directionList[7]){
        // left up
        updateAndSend(directionList[7]);
        //console.log("left up");

    }else{
        //releaseAll(player.sendCommand);
    }
  }
  // Helper functions
  function getPosition(element) {
    var xPosition = 0;
    var yPosition = 0;

    while(element) {
        xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
        yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
        element = element.offsetParent;
    }
    return { x: xPosition, y: yPosition };
  }
  function getRot(x,y,orignx,origny){
    //orignx and origny is the center of div
    var x=x-orignx;
    var y=y-origny;
    return Math.round(Math.atan2(x, y)*57.3/6);
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
      lastRot=360;
      lastRotUpdate=360;
      ctrlStatus=0;
      break;
    }
  },20);
};
