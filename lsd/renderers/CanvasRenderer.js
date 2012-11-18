/****
	2d canvas renderer... for mobile and non WebGL.

	@inherits BaseRenderer
***/
var CanvasRenderer = function (lsd, layers, canvasId, compositeTypes) {
	BaseRenderer.init.apply(this, arguments);
};

CanvasRenderer.prototype = {};
$.extend(CanvasRenderer.prototype, BaseRenderer.prototype, {
	getContext : function getContext() {
		if (this.canvas && this.canvas.getContext) {
			return this.canvas.getContext('2d');
		}

		return null;
	},

	/*** 
		Starts the animation rendering.

		Returns true if successful, false if not supported.
	***/
	start : function start() {
		var self = this,
			lsd = this.lsd,
			ctx = this.getContext(),
			canvas = this.canvas;

		if (!ctx) return false;

		//from http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
		// shim layer with setTimeout fallback
		(function() {
			var lastTime = 0;
			var vendors = ['ms', 'moz', 'webkit', 'o'];
			for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
				window.cancelAnimationFrame = 
				  window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
			}
		 
			if (!window.requestAnimationFrame)
				window.requestAnimationFrame = function(callback, element) {
					var currTime = new Date().getTime();
					var timeToCall = Math.max(0, 16 - (currTime - lastTime));
					var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
					  timeToCall);
					lastTime = currTime + timeToCall;
					return id;
				};
		 
			if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id) {
					clearTimeout(id);
				};
		}());


		//animates the mixer according to input from lastEvent
		var drawFrame = function () {			
			if (lsd.isPaused)
				return;
				
			ctx.globalAlpha = 1.0;
			
			//ctx.fillStyle = 'rgba(0,0,0,0)';
			ctx.clearRect(0, 0, canvas.width, canvas.height);
				

			
			/*
			var compositeIndex = limitNum(0,
									Math.round((e.clientX / $(canvas).width()) * compositeTypes.length), 
									compositeTypes.length
								);
			*/
			
			var rotation = 0;//limitNum(0, (e.clientX / $(canvas).width()) / 5.0, 0.1);
				zoom = 0,//limitNum(1, (e.clientX / $(canvas).width()) * 5.0, 1000);

			
			//layer the images on top of each other
			ctx.globalCompositeOperation = self.getBlendMode();
			//$msg.html("zoom: " + zoom + " rotation: " + rotation + " opacity: " + ctx.globalAlpha);
			for (var i in self.layers) {
				ctx.save();
				//ctx.scale(zoom, zoom);
				//ctx.rotate(rotation);
								
				//ctx.drawImage(layers[i].imageObj, 0, 0, canvas.width, canvas.height);
				self.layers[i].draw(ctx, 0, 0, canvas.width, canvas.height);
				ctx.restore();
			}
		};
		//drawFrameIntervalId = setInterval(drawFrame, DRAW_FRAMERATE);
		(function animloop(){
		  window.requestAnimationFrame(animloop);
		  drawFrame();
		})();

		return true;
	}
});