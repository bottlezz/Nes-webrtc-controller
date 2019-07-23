function ControlPad(id,callBack,endCallBack){
    var pad=document.getElementById(id);
    var padCord=getPosition(pad);
    this.x=-1;
    this.y=-1;
    this.rot=-1;
    var self=this;
    pad.addEventListener('touchmove', function(event) {
      event.preventDefault();
      var touch = event.targetTouches[0];
      self.x = touch.pageX -padCord.x;
      self.y = touch.pageY -padCord.y;
  
      callBack(self.x,self.y);
  
    }, false);
    pad.addEventListener('touchstart', function(event) {
      event.preventDefault();
      var touch = event.targetTouches[0];
      self.x = touch.pageX -padCord.x;
      self.y = touch.pageY -padCord.y;
  
      callBack(self.x,self.y);
    }, false);
  
    pad.addEventListener('touchend', function(event) {
      event.preventDefault();
      endCallBack(self.x,self.y);
    }, false);
  
  
  };
  function TouchPad(id,touchCallBack){
    var pad=document.getElementById(id);
    pad.addEventListener('touchstart', function(event) {
      event.preventDefault();
      touchCallBack();
    });
  };
  function getRot(x,y,orignx,origny){
    //orignx and origny is the center of div
    var x=x-orignx;
    var y=y-origny;
    return Math.round(Math.atan2(x, y)*57.3/6);
  }
  
  
  
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
  function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;
  
    var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
  
    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
      requestFullScreen.call(docEl);
    }
    else {
      cancelFullScreen.call(doc);
    }
  }