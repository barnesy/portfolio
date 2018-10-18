// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

var Anim = { //animation settings
    'duration': 3000,
    'interval' : 10,
    'stepUnit' : 1.0,
    'currUnit' : 0.0
}

function Gradient(context, width, height){
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.colorStops = [];
    this.currentStop = 0;
}

Gradient.prototype.addStop = function(pos, colors){
    var stop = {'pos': pos, 'colors':colors, 'currColor': null}
    this.colorStops.push(stop)
}

Gradient.prototype.updateStops = function(){ //interpolate colors of stops
    var steps = Anim.duration / Anim.interval,
    		step_u = Anim.stepUnit/steps
    		stopsLength = this.colorStops[0].colors.length - 1;

    for(var i = 0; i < this.colorStops.length; i++){ //cycle through all stops in gradient
        var stop = this.colorStops[i],
        		startColor = stop.colors[this.currentStop],//get stop 1 color
        		endColor, r, g, b;

				if(this.currentStop < stopsLength){ //get stop 2 color, go to first if at last stop
					endColor = stop.colors[this.currentStop + 1];
				} else {
					endColor = stop.colors[0];
				}

        //interpolate both stop 1&2 colors to get new color based on animaiton unit
        r = Math.floor(lerp(startColor.r, endColor.r, Anim.currUnit));
        g = Math.floor(lerp(startColor.g, endColor.g, Anim.currUnit));
        b = Math.floor(lerp(startColor.b, endColor.b, Anim.currUnit));

        stop.currColor = 'rgb('+r+','+g+','+b+')';
    }

    // update current stop and animation units if interpolaiton is complete
   	if (Anim.currUnit >= 1.0){
   		Anim.currUnit = 0;
   		if(this.currentStop < stopsLength){
   			this.currentStop++;
   		} else {
   			this.currentStop = 0;
   		}
   	}

   	Anim.currUnit += step_u; //increment animation unit
}

Gradient.prototype.draw = function(){
		var gradient = ctx.createLinearGradient(0,0,this.width,this.height);

    for(var i = 0; i < this.colorStops.length; i++){
        var stop = this.colorStops[i],
        		pos = stop.pos,
            color = stop.currColor;

        gradient.addColorStop(pos,color);
    }

    this.ctx.clearRect(0,0,this.width,this.height);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0,0,this.width,this.height);
    this.ctx.filter = 'grayscale(100%)';
}

var $width, $height, gradient,
		canvas = document.getElementById("canvas"),
		ctx = canvas.getContext("2d"),
    stopAColor = [
    { 'r':'255', 'g':'255', 'b':'255' }, //yellow
    { 'r':'100', 'g':'100', 'b':'100' }, //red
    { 'r':'175', 'g':'175', 'b':'175' }, //yellow
    { 'r':'200', 'g':'200', 'b':'200' } //red
    ],
    stopBColor = [
    { 'r':'200', 'g':'200', 'b':'200' }, //red
    { 'r':'255', 'g':'255', 'b':'255' }, //yellow
    { 'r':'175', 'g':'175', 'b':'175' }, //red
    { 'r':'100', 'g':'100', 'b':'100' } //yellow
    ];

var updateUI = function(){
		$width = window.innerWidth,
		$height = window.innerHeight;

		canvas.width = $width;
		canvas.height = $height;

		gradient = new Gradient(ctx, canvas.width, canvas.height);
		gradient.addStop(0, stopAColor);
		gradient.addStop(1, stopBColor);
}


var resizeTimeout;

function resizeThrottler() {
  // ignore resize events as long as an actualResizeHandler execution is in the queue
  if ( !resizeTimeout ) {
    resizeTimeout = setTimeout(function() {
      resizeTimeout = null;
      actualResizeHandler();

     // The actualResizeHandler will execute at a rate of 15fps
     }, 66);
  }
}

function actualResizeHandler() {
  // handle the resize event
  updateUI();
}

//interpolation
function lerp(a, b, u) {
    return (1 - u) * a + u * b;
}

(function (){

	  updateUI();

    window.addEventListener("resize", resizeThrottler, false);

	  (function animloop(){
	    requestAnimFrame(animloop);
	    gradient.updateStops();
	    gradient.draw();
	  })();

}());
