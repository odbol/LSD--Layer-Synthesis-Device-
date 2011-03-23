/* LSD: Layer Synthesis Device

	The Creature is a Beast in the Wild and a Vegetable in the City. 
	The Node of Self-Interruption is Connected to Many Points.
	
	Requires:
		jQuery 1.4
		jQuery UI with slider and tabs
		image_preloader.js
		imageSlider.js
		HTML5
	
	Copyright 2010 Tyler Freeman
	http://odbol.com
	
	
	-- License --
	This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/  

const LICENSE_HTML = '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png" /></a>'; //<br /><span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dc:title" rel="dc:type">LSD (Layer Synthesis Device)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com" property="cc:attributionName" rel="cc:attributionURL">odbol</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://odbol.com/lsd" rel="dc:source">odbol.com</a>.'
const REQUIREMENTS_HTML = "<p>Supported on Firefox 3.5+, Safari 4+, Chrome, iPhone, Android (no IE, what a surprise...)</p>"
const ABOUT_HTML = "<h2>LSD (Layer Synthesis Device)</h2><h3>VJing in HTML5</h3>" +
			"<p>Use LSD to VJ live video on the web! Choose video clips and images and blend them together using the mixer controls " +
			"or the interactive mouse mode. Create your customized hallucination directly in your browser and share with your friends!</p>" +		
			"<h4>Layers</h4>" + 
			"<p>You can control the mixing of the layers with the sliders below.<br />" +
			"Click the layer's thumbnail to choose a different video and blend mode.</p>" +
			"<h4>Interactive Mouse Mode</h4>" + 
			"<p><em>Hold shift to temporarily activate interactive mouse mode, or check the box.</em><br />" + 
			"Click the mouse to change the blend mode.<br />" +
			"Move the mouse up and down to control opacity of the top two layers.<br />" + 
			"Move the mouse right to exacerbate the top layer's seizures, move it left to give the poor guy a rest (Sheesh!).</p>" +
			"<h4>About</h4>" +
			REQUIREMENTS_HTML + 
			"<p>Code and content by <a href='http://odbol.com'>odbol</a>, 2010&nbsp;" + LICENSE_HTML + "</p>"
const ERROR_MSG_HTML_START = 
'		<div class="ui-widget">' +
'			<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"> ' +
'				<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> ' +
'				<strong>Error:</strong> '

const ERROR_MSG_HTML_END = '</p>' +
'			</div>' +
'		</div>	'

const CLIP_BUTTON_HTML = '<div class="button ui-state-default ui-corner-bottom"><span class="ui-icon ui-icon-triangle-1-s"></span></div>'
			
					
const DRAW_FRAMERATE = 33;
const INTERACTIVE_MODE = {OFF: 0, ON: 1, TOGGLED: 2}; //enum for isInteractiveMode

const CLIP_PAGE_SIZE = 9


function limitNum(min, num, max) {
	return Math.max(min, Math.min(max, num));
}
  

//////////////////////////////
// 	VidLayer CLASS
//
//	Used as a layer to draw media clips 
//
//////////////////////////////
VidLayer.prototype.clip; //holds a VidClip
VidLayer.prototype.image = null; //holds an Image or Video tag source
//loads a new VidSource object and plays as soon as it's available
VidLayer.prototype.opacity = 1.0;
VidLayer.prototype.load = function (clip) {
	this.clip = clip;
	//this.image = null; 
	var parentLayer = this;
	clip.load(function (loadedImage) {
		if (parentLayer.image != null && parentLayer.image.pause) //stop last video, if it is
			parentLayer.image.pause();
			
		parentLayer.image = loadedImage;
		
		if (loadedImage.play) //if video, resume playing
			loadedImage.play();
	});
}
//draws the image on context ctx in the coordinates given.
VidLayer.prototype.draw = function (ctx, x1, y1, x2, y2) {
	if (this.image) { //check if not loaded yet!
		ctx.globalAlpha = this.opacity;
					
		ctx.drawImage(this.image, x1, y1, x2, y2);
	}
}
function VidLayer(clip) {
	if (clip)
		this.load(clip);
	return this;
}  


(function( $ ){
//$(function(){

	//installs and runs LSD in the background of your page content
	//	vidClips		-	array of vidClips for clip library. the first numLayers will be loaded into layer.
	//	compositeTypes	-	optional array of globalCompositeOperation types to use (default: all)
	//	numLayers		-	optional number of layers to initalize (default 3 recommended)
   $.fn.takeLSD = function(vidClips, compositeTypes, numLayers) {
		//move whole page into holder so we can cover it/ put the background behind it.
		$("body")
			.append("<div id='realbody'><div>Loading LSD...</div></div>")
			.find("#realbody div")
				.replaceWith($("body").children(":not(#realbody, script)"));
		$("body")
			.append("<div id='backgroundHolder'><canvas id='backgroundCanvas' width='320' height='240'></canvas></div>");

		var canvas = document.getElementById('backgroundCanvas');
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			
			var compositeIndex = 0;
			if (!compositeTypes)
				compositeTypes = ['lighter','darker','copy','xor',
				  'source-over','source-in','source-out','source-atop',
				  'destination-over','destination-in','destination-out','destination-atop'
				];
			
			if (!(numLayers > 0))
				numLayers = 3;
			
			//fill the layers array with our media sources 
			var layers = new Array(numLayers);
			for (var i = 0; i < numLayers; i++) {
				layers[i] = new VidLayer(vidClips[i]); //the clip thumbs will be added to GUI later, during clip initialization
			
				if (compositeTypes[compositeIndex] == "lighter")
					layers[i].opacity = 0.7;
			}
				
			 //GLOBALS!
			var currentLayer = null;
			var currentLayerControl = null; //should be initialized once control panel behaviour(!) is initialized
			
			var isInteractiveMode = INTERACTIVE_MODE.ON; //indicates if the mouse should control sliders automatically
			
			//////////////////////////////
			//BUILD HTML CONTROLS
			//////////////////////////////
			var iconsHTML = "<h1><a href='http://odbol.com/lsd' title='Click to take LSD'>LSD Visuals</a></h1><ul class='icons buttons ui-widget ui-helper-clearfix'>" +
				"<li id='buttonHelp' title='Help/About' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-help'></span></li>" +		
				"<li id='buttonFullscreen' title='Fullscreen Visuals' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-arrow-4-diag'></span></li>" +		
				"<li id='buttonStop' title='Stop Visuals' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-closethick'></span></li>" +
				"</ul>"
				
			//build html control for composite
			var compHTML = "<select id='compositionSelector'>";
			for (i in compositeTypes) 
				compHTML += "<option value='" + i + "'>" + compositeTypes[i] + "</option>";
			compHTML += "</select>";
			
			var sliderHTML = "<div class='globalOptions'>" + 
				"<label id='interactiveToggle'><input type='checkbox' value='true' />Interactive Mouse Mode</label>" +
				"</div>"
			
			
			sliderHTML += "<div class='layerSliders'>";
			for (i in layers) 
				sliderHTML += "<div class='layerControl' id='layerControl_" + i + "'><div class='slider'></div><div class='clipThumb'></div></div>";
			//sliderHTML += "</div>";
			
			sliderHTML += "<div class='sharedControls'>" + compHTML;
			
			//add video thumbs
			sliderHTML += "<div class='clipThumbs imageSlider'>" +
				"<div class='ui-widget ui-helper-clearfix'><a href='#' class='previous button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-w'>Previous</span></a><a href='#' class='next button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-e'>Next</span></a></div>" +
				" <div class='panelHolder'>" +
				"	<div class='slidingPanel'>" +
						"<ul>";
			for (i in vidClips) {
				//separate lists in pages for horizontal scrolling
				if (i > 0 && i % CLIP_PAGE_SIZE == 0) 
					sliderHTML += "</ul><ul>"
				sliderHTML += "<li id='vidClip_" + i + "' class='clipThumb'><img src='" + vidClips[i].thumbnail + "' /></li>";
			}
			sliderHTML += "</ul></div></div>" + //end panelHolder
				//"<br class='clear' />" +
				"</div>";
		
		
		
		
		
		
		
			sliderHTML += "</div></div>"; //end sharedCOntrols, layerSliders
			
			$("body").append("<div id='backgroundCanvasControls' class='ui-corner-all'>" + iconsHTML +
				"<div class='aboutBox'>" + ABOUT_HTML + "</div>" +
				"<div class='controlPanel'>" + sliderHTML + "</div></div>");
		
			
			//////////////////////////////
			// EVENT BEHAVIORS
			//////////////////////////////
			$("#interactiveToggle input")
				.change(function () {
					if (isInteractiveMode != INTERACTIVE_MODE.TOGGLED) { //don't change if we're updating GUI programmatically
						if ($(this).attr("checked")) {
							isInteractiveMode = INTERACTIVE_MODE.ON;
						}
						else {
							isInteractiveMode = INTERACTIVE_MODE.OFF;
						}
					}
				});
			if (isInteractiveMode) //init HTML
				$("#interactiveToggle input").attr("checked", true);
			
			$("#compositionSelector")
				.change(function () {
					compositeIndex = parseInt($(this).val());
				});
				
				
			
			//layer controls
			var setCurrentLayer = function (layerControlElement) { 	
				currentLayerControl = layerControlElement;			
				currentLayer = currentLayerControl.data("vidLayer");
				
				//visually toggle it
				$("#backgroundCanvasControls .layerControl").removeClass("current");
/*					.find(".ui-icon")
						.removeClass('ui-icon-triangle-1-n')
						.addClass('ui-icon-triangle-1-s');*/
				currentLayerControl.addClass('current'); /*
					.find(".ui-icon").addClass('ui-icon-triangle-1-n');*/
			}
			$("#backgroundCanvasControls .layerControl")
				.each(function (i, el) {	//add linkback data from tags to objects
					$(this).data("vidLayer", layers[i]); //assumes their in the same order as the array. risky....
				})
				.click(function () { 	
					setCurrentLayer($(this));
				})
				.eq(0).click(); //initialize: select first layer as current
			
			
			//only show shared controls when hovering over them.
	//		var isOverSharedControls = false;
			$("#backgroundCanvasControls .sharedControls")
	// 			.hover(
	// 				function (e) {isOverSharedControls = true;}, 
	// 				function (e) {isOverSharedControls = false;}
	// 			)
				.hide();
			
	//		var delaySlideIntId = 0;
	
			//slide the clips down when they click layer clip
			var isSharedControlsShown = false;
			var showSharedControls = function (e) {
					$("#backgroundCanvasControls").addClass("sharedOpen")
						.find(".sharedControls")
							.slideDown('slow');
					
					isSharedControlsShown = e.target; //holds the object that triggered the showing
				};
			var hideSharedControls = function (e) {
						// if (delaySlideIntId != 0) {
	// 						delaySlideIntId = setInterval(
	// 							function () {
	// 								if (!isOverSharedControls) {
										$("#backgroundCanvasControls").removeClass("sharedOpen")
											.find(".sharedControls")
												.slideUp('slow');
											
										isSharedControlsShown = false;	
									// 	
	// 									clearInterval(delaySlideIntId);
	// 									delaySlideIntId = 0;
	// 								}
	// 							}, 500);
	//					}
			}
			var toggleSharedControls = function (e) {
					if (isSharedControlsShown) {
						if (e.target == isSharedControlsShown) //only hide if they clicked the same button again!
							hideSharedControls(e);
						else
							isSharedControlsShown = e.target; //holds the object that triggered the showing
					}
					else
						showSharedControls(e);
				};
			
			//layer preview thumb
			$("#backgroundCanvasControls .layerControl .clipThumb")
				//.toggle(, hideSharedControls)
				.click(function (e) {
					toggleSharedControls(e);
					setCurrentLayer($(this).parent());
				});
					
			
			//CLIP THUMBS
			$("#backgroundCanvasControls .clipThumbs .clipThumb")
				.each(function (i, el) {	//add linkback data from tags to objects
					$(this).data("vidClip", vidClips[i]); //assumes they're in the same order as the array. risky....
				})
				.click(function () { 		//load clip's video into current layer
					if (currentLayer) {
						var $this = $(this);
						currentLayer.load($this.data("vidClip"));
						currentLayerControl.find(".clipThumb").html($this.html() + CLIP_BUTTON_HTML); //put the current clip thumb in there.
						
						hideSharedControls();
					}
				})
				.slice(0, 3) //add the thumbs for the first three already-loaded clips into the layers
					.each(function (i, el) { 
						$("#layerControl_" + i).find(".clipThumb").html($(this).html() + CLIP_BUTTON_HTML); //put the current clip thumb in there.
					});
			
			//clip thumb scrolling
			var clipScroller = new ImageSlider($("#backgroundCanvasControls .clipThumbs"), 3, Math.ceil(vidClips.length / 9.0 / 3.0), ".clipThumb")
			
			
			//BUTTONS
			var hideControls = function () {
				$("#backgroundCanvasControls .controlPanel, #buttonHelp, #backgroundCanvasControls .aboutBox").hide('fast');
					
				//$("#backgroundCanvasControls").switchClass("maximized", "minimized", 500);
				$("#backgroundCanvasControls").animate({width:"150px"}, 100);		
			};
			var maximizeControls = function () {
				$("#backgroundCanvasControls").animate({width:"400px"}, 100);
			};
			var minimizeControls = function () {
				//$("#backgroundCanvasControls").switchClass("minimized", "maximized", 500);
				$("#backgroundCanvasControls").animate({width:"187px"}, 100);
	
				$("#backgroundCanvasControls .aboutBox").hide('fast'); //about only shown in maximized!
			};
			
			var isFullscreen = false;
			$("#buttonFullscreen").click(function (e) {
				//toggle fullscreen
				if (isFullscreen) {
					hideControls();
					$("#backgroundHolder").css("zIndex", 1);
				}
				else {
					minimizeControls();
					$("#backgroundCanvasControls .controlPanel, #buttonHelp").show('fast');
					$("#backgroundHolder").css("zIndex", 500);
				}
				isFullscreen = !isFullscreen;
			});
			var drawFrameIntervalId = 0;
			$("#buttonStop").click(function (e) {
				if (drawFrameIntervalId > 0) {
					clearInterval(drawFrameIntervalId);
					drawFrameIntervalId = 0;
					
					$("body").unbind(".lsd"); //stop all events and animation
					//TODO: garbage collection! yeah right!
					$("#backgroundHolder, #backgroundCanvasControls").hide(); //get rid of the evidence!
				}
			});
			$("#buttonHelp").toggle(function (e) {
					//$("#backgroundCanvasControls .controlPanel").hide('fast');
					maximizeControls();
					$("#backgroundCanvasControls .aboutBox").show('fast');
				}, 
				function (e) {
					minimizeControls();
					//$("#backgroundCanvasControls .controlPanel").show('fast');
				});		
			
			//hover states on the buttons
			$('#backgroundCanvasControls .button').hover(
				function() { $(this).addClass('ui-state-hover'); }, 
				function() { $(this).removeClass('ui-state-hover'); }
			);
			
			$("#backgroundCanvasControls .layerControl .clipThumb").hover(
				function () {
					$(this).find(".button").addClass('ui-state-hover');
				},
				function () {
					$(this).find(".button").removeClass('ui-state-hover');
				}
			);
				
			
			//$("#realbody").append("<p id='msg'></p>");
			
			
			//LOAD IMAGES AND DRAW ON EACH FRAME
	//		var preloader = new ImagePreloader(bgs, function (imgs, numLoaded) {
				//GLOBALS
				var lastEvent;		
			
				var $body = $('body');
				var $msg = $('#msg');
	
	
				//OPACITY SLIDERS
				var interactiveOff = function () { //turn interactive off if they try to change manually
								$("#interactiveToggle input").attr("checked", false).change();
							}
				$("#backgroundCanvasControls .layerSliders .slider").each(function (i, e) {
					var onSlide = function (event, ui) {
									var $this = $(this);
									
									$this.data("vidLayer").opacity = parseFloat($this.slider("option", "value"));
							};
					
					var slideOpts = {
							slide: onSlide,
							change: onSlide,
							animate: 'fast',
							min: 0.0,
							max: 1.0,
							step: 0.1,
							orientation: 'vertical',
							value: layers[i].opacity
						};
						
					if (i > 0) //turn interactive off if they try to change manually
						slideOpts["start"] = interactiveOff;
					
					$(this)
						.data("vidLayer", layers[i])
						.slider(slideOpts);
						
				});

				
				//TODO: ("implement media.playbackRate!!!!");
				//RATE SLIDER
				
				var mouseMoveDelay = 0;
				$body.bind("mousemove.lsd", function(e) {
					lastEvent = e;
					
					if (e.shiftKey) { //temporarily activates interactive mode
						if (isInteractiveMode == INTERACTIVE_MODE.OFF) {
							$("#interactiveToggle input").attr("checked", true);
							
							isInteractiveMode = INTERACTIVE_MODE.TOGGLED;
						}
					}
					else {
						if (isInteractiveMode == INTERACTIVE_MODE.TOGGLED) {
							$("#interactiveToggle input").attr("checked", false);
							
							isInteractiveMode = INTERACTIVE_MODE.OFF;
						}
					}
					
					if (isInteractiveMode) {
						var layerAlpha = 1.0 - (e.clientY / $(canvas).height() * 0.7); //don't let them turn it all the way down
						$("#backgroundCanvasControls .layerSliders .slider").eq(2)
							.slider("option", "value", layerAlpha);
							
						layerAlpha = (e.clientX / $(canvas).width() * 0.7) + 0.3; //don't let them turn it all the way down
						$("#backgroundCanvasControls .layerSliders .slider").eq(1)
							.slider("option", "value", layerAlpha);
							
						//$msg.html("alpha: " + layerAlpha);
					}
				});
				
				//animates the mixer according to input from lastEvent
				var drawFrame = function () {
					if (!(e = lastEvent))
						return;
						
					ctx.globalAlpha = 1.0;
					
					//ctx.fillStyle = '#000';
					ctx.clearRect(0, 0, canvas.width, canvas.height);
						
				
					
					/*
					var compositeIndex = limitNum(0,
											Math.round((e.clientX / $(canvas).width()) * compositeTypes.length), 
											compositeTypes.length
										);
					*/
					
					var rotation = 0;//limitNum(0, (e.clientX / $(canvas).width()) / 5.0, 0.1);
					var zoom = 0;//limitNum(1, (e.clientX / $(canvas).width()) * 5.0, 1000);
					
					//calculate the random shake
					var walkDistance = limitNum(1, (e.clientX / $(canvas).width()) * 10.0, 10)
					var walkScaleX = (canvas.width + walkDistance + 1) / canvas.width;
					var walkScaleY = (canvas.height + walkDistance + 1) / canvas.height;			
					
					//layer the images on top of each other
					ctx.globalCompositeOperation = compositeTypes[compositeIndex];
					//$msg.html("zoom: " + zoom + " rotation: " + rotation + " opacity: " + ctx.globalAlpha);
					for (i in layers) {
						ctx.save();
						//ctx.scale(zoom, zoom);
						//ctx.rotate(rotation);
						
						//shake the last image
						if (isInteractiveMode && i == layers.length - 1) {
							var walkX = Math.random() * walkDistance;
							var walkY = Math.random() * walkDistance;
							//$msg.append("walking: " + walkX + ", " + walkY);
							
							ctx.scale(walkScaleX, walkScaleY);
							ctx.translate(-walkX, -walkY);
						}
						
						//ctx.drawImage(layers[i].imageObj, 0, 0, canvas.width, canvas.height);
						layers[i].draw(ctx, 0, 0, canvas.width, canvas.height);
						ctx.restore();
					}
				};
				drawFrameIntervalId = setInterval(drawFrame, DRAW_FRAMERATE);
				
				$(canvas).bind("mousedown.lsd", function () {
					compositeIndex = (compositeIndex + 1) % compositeTypes.length;
					$("#compositionSelector").val(compositeIndex);
				});
				
			//});
		}
		else { //HTML5 fail!
			$("body").prepend(ERROR_MSG_HTML_START + "Sorry! Your browser isn't strong enough to take LSD.<br /><br />" + REQUIREMENTS_HTML + ERROR_MSG_HTML_END);
		}
	}	

})( jQuery );
//});