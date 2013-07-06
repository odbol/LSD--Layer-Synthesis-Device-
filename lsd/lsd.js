/* LSD: Layer Synthesis Device

	The Creature is a Beast in the Wild and a Vegetable in the City. 
	The Node of Self-Interruption is Connected to Many Points.
	
	Requires:
		jQuery 1.4
		jQuery UI with slider and tabs
		image_preloader.js
		imageSlider.js
		fd-slider
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



/************* TEXTUAL RESOURCES for Internationalization **********/
// TODO: move this to separate file.
var TEXT_CLICK_VERB = 'Click';
if (Modernizr.touch) {
	TEXT_CLICK_VERB = 'Touch';
}
var TEXT_STEP_EFFECTS_HELP = TEXT_CLICK_VERB + ' and drag anywhere on the video to control effects. Each ' +
	(Modernizr.touch ? 'finger' : 'mouse button' ) +
	' controls a different layer&apos;s effect.';

/************* END TEXTUAL RESOURCES  **********/



var LICENSE_HTML = '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png" /></a>'; //<br /><span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dc:title" rel="dc:type">LSD (Layer Synthesis Device)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com" property="cc:attributionName" rel="cc:attributionURL">odbol</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://lsd.odbol.com" rel="dc:source">odbol.com</a>.'
var REQUIREMENTS_HTML = "<p>Supported on Firefox 3.5+, Safari 4+, Chrome, iPhone, Android (no IE, what a surprise...)</p>";
var ABOUT_HTML = "<h2>LSD (Layer Synthesis Device)</h2><h3>VJing in HTML5</h3>" +
			"<p>Use LSD to VJ live video on the web! Choose video clips and images and blend them together using the mixer controls " +
			"or the interactive mouse mode. Create your customized hallucination directly in your browser and share with your friends!</p>" +		
			"<h4>Layers</h4>" + 
			"<p>You can control the mixing of the layers with the sliders below.<br />" +
			"Click the layer's thumbnail to choose a different video and blend mode.</p>" +
			"<h4>Keyboard Controls</h4>" + 
			"<p><strong>S or Enter</strong>: Show the QR code for screen sharing.<br />" +
			"<p><strong>L or Space</strong>: Show the smaller, corner URL for screen sharing.<br />" +
			"<strong>C or Esc</strong>: Hide all controls and windows.<br />" + 
			"<strong>SHIFT (hold)</strong>: temporarily activate interactive mouse mode.<br />" + 
			"Click the mouse to change the blend mode.</p>" +
			"<h4>About</h4>" +
			REQUIREMENTS_HTML + 
			"<p>Code and video content by <a href='http://odbol.com'>odbol</a>, 2010&nbsp;" + LICENSE_HTML + "<br />GIFs by <a href='http://lcky.tumblr.com/' target='_blank'>Adam Harms</a>, <a href='http://dvdp.tumblr.com/' target='_blank'>David Ope</a>, <a href='http://surrogate-self.com/' target='_blank'>Surrogate Self</a>, <a href='http://pixelfucks.com' target='_blank'>pixelf*cks</a>, and unknown sources.</p>";
var ERROR_MSG_HTML_START = 
'		<div class="ui-widget">' +
'			<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"> ' +
'				<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> ' +
'				<strong>Error:</strong> ';

var ERROR_MSG_HTML_END = '</p>' +
'			</div>' +
'		</div>	';

var HTML_ERROR_NOT_SUPPORTED = '<p class="error">Sorry, your browser is not compatible. Please download the latest Chrome or Firefox browser for the best performance.</p>';

var CLIP_BUTTON_HTML = '<div class="button ui-state-default ui-corner-bottom"><span class="ui-icon ui-icon-triangle-1-s"></span></div><span class="spinner" />';
		
		
var INTRO_HTML = '<div id="intro" class="dialogControls">' +
		'<h2>You are now on LSD</h2>' +
		'<p>LSD is a collaborative VJ app. Everyone controls the same screen!</p>' +
		'<p class="tips">Use the red sliders on the right to mix videos.<br />' +
		'Click the thumbnails to change the videos.</p>' +
		//'<p><label for="e">Your Name:</label> <input type="text" id="vjName" name="vjName" value="VJ Default" /></p>' +
		'<a class="dialogButton buttonClose" href="#">Join this screen</a><br />' +
		'<a class="dialogButton buttonFind" href="#">Control a nearby screen</a><br />' +
		'<a class="dialogButton buttonNew" href="#">Start your own screen</a><br />' +
		'</div>';
		
var SCREEN_LIST_HTML = '<div id="screenList"><h2 class="chooseHeader">Choose a Screen to Control:</h2>' +
		'<ul><li class="loading">Loading...</li></ul></div>';

var SCREEN_LIST_HOLDER_START = '<div id="screenListDialog" class="dialogControls">';
var SCREEN_LIST_HOLDER_END = 	
		'<a class="dialogButton buttonClose" href="#">Cancel</a><br />' +
		'</div>';
		
var SHARE_LOGO_HTML = '<div id="shareLogo" class="bottom">Control This Screen: <a href="http://lsd.odbol.com">lsd.odbol.com</a></div>';
					




var DRAW_FRAMERATE = 33;
var INTERACTIVE_MODE = {OFF: 0, ON: 1, TOGGLED: 2}; //enum for isInteractiveMode

var CLIP_PAGE_SIZE = 9;

// lets you minimize LSD and brings up the original page body over the canvas, so LSD is a background
var ENABLE_BACKGROUNDING = false;

//if true, the blending effect will change when you click anywhere on the canvas (doesn't work so well on mobile)
var enableBlendEffectOnClick = false;//!isMobile;

//range input sliders don't work in firefox.
//jQuery sliders don't work in mobile. what's a dev to do? BOOLEAN IT
//on second thought, just use the fdSliders exclusively, since the jQuery sliders no longer tween or any fancy stuff
var enableHTML5Range = true || isMobile;

//set to true if you want your computer to hate you.
var enablePreloading = false;


var isDebug = (/debug=true/).test(window.location.href);

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
VidLayer.prototype.id = 0;

VidLayer.prototype.getOpacity = function getOpacity() {
	return this.opacity;
};
VidLayer.prototype.setOpacity = function setOpacity(val) {
	this.opacity = val;

	this.$self.trigger('layerSetOpacity.lsd', [val]);
};
VidLayer.prototype.bind = function bind(eventName, cb) {
	return this.$self.bind(eventName, cb);
};
VidLayer.prototype.load = function (clip) {
	this.clip = clip;
	//this.image = null; 
	var self = this;


	if (self.$el) {
		self.$el.find(".clipThumb").html($(clip.element).html() + CLIP_BUTTON_HTML); //put the current clip thumb in there.

		self.$el
			.addClass('isLoading');
	}

	clip.load(function (loadedImage) {
		if (clip != self.clip) //this callback is late, the layer has already moved on to another clip so don't load the old one! (happens on startup)
			return;


		if (self.image) { //unload (hide) last vid, for performance (don't want a billion GIFs running at once)
			self.image.style.display = 'none';
			
			if (self.image.pause) //stop last video, if it is
				self.image.pause();
		}
		
		self.image = loadedImage;
		
		loadedImage.style.display = 'block'; //make sure the image is now shown again if it was hidden before
		
		if (loadedImage.play) //if video, resume playing
			loadedImage.play();


		// trigger the event first???, so seriously has time before its paused???
		self.$self.trigger('clipLoaded.lsd', [self]);


		if (self.$el) {
			self.$el
				.removeClass('isLoading');
		}
	});
};
//draws the image on context ctx in the coordinates given.
VidLayer.prototype.draw = function (ctx, x1, y1, x2, y2) {
	if (this.image) { //check if not loaded yet!
		ctx.globalAlpha = this.getOpacity();
					
		ctx.drawImage(this.image, x1, y1, x2, y2);
	}
};
function VidLayer(clip, id, el) {
	if (clip)
		this.load(clip);
		
	this.id = id;

	// cache the jQuery ref for quicker event triggering
	this.$self = $(this);

	this.$el = $(el);
	
	return this;
}  

/****
	Attribution Class
	
	Holds author credits for something.
	 
***/
function Attribution(author, title, link) {
	this.author = author;
	this.title = title; 
	this.link = link;
}
Attribution.prototype = {
	author: '',
	title: '',
	link: '',
	toString: function toString(isHtml, isLinked) {
		if (isHtml) {
			var html =	(this.author ? ' <span class="attribAuthor">' + this.author + '</span>': '')
				+ '<span class="attribTitle">' + this.title + '</span>';
			
			if (isLinked && this.link) {
				html = '<a href="' + this.link + '">' + html + '</a>';
			}
	
			return '<span class="attribution">' + html + "</span>";
		}
		else {
			return this.title + (this.author ? ' - ' + this.author : '');
		}
	}
};

/***
	Triggers a DOM event without jQuery, since Seriously uses normal events.
***/
function triggerEvent(eventName, input) { 
	if (input.fireEvent) {
		input.fireEvent("on" + eventName);
	}
	else {
	    var ev = document.createEvent('HTMLEvents');
	    ev.initEvent(eventName, true, false);
	    input.dispatchEvent(ev);
	}
}

//scales a number to fit within the new extrema.
//if hardCutoff is true, it will not exceed the extrema
var scaleRange = function scaleRange(num, oldMin, oldMax, newMin, newMax, isHardCutoff) {
  var n =  ((num - oldMin) / ((oldMax - oldMin) / (newMax - newMin))) + newMin;
  if (isHardCutoff) {
	if (n < newMin) 
	  n = newMin;
	else if (n > newMax)
	  n = newMax;
  }
  return n;
};

(function( $ ){
//$(function(){

   var LSD = function LSD() {
   
   };
   
   LSD.prototype = {
		isPaused: false,
		crowd: null,
		vidClips : [],
		getVidClipById : function(clipId) {
			for (var j in this.vidClips) {
				if ( this.vidClips[j].id == clipId ) {
					return this.vidClips[j];
				}
			}
			
			return null;
		},
	
	//installs and runs LSD in the background of your page content
	//	vidClips		-	array of vidClips for clip library. the first numLayers will be loaded into layer.
	//	compositeTypes	-	optional array of globalCompositeOperation types to use (default: all)
	//	numLayers		-	optional number of layers to initalize (default 3 recommended)
	//  userId			-	optional id of user - alphanumeric only.
	//  crowd			-	optional CrowdControl object if you want collaborative features.
	//  shouldInitClips -   optional bool indicating if initial 3 clips should be loaded, or wait for load event from something else. (basically should it start at black or with the first GIFs)
	//  resolution		-	optional Object giving dimensions of canvas. default {width: 320, height: 240}
	//  minRating		- 	optional int of minimum rating to filter vidClips by
   init : function init(vidClips, compositeTypes, numLayers, userId, crowd, shouldInitClips, resolution, minRating) {
		var lsd = this;
		
		resolution = resolution || {width: 320, height: 240};
		

		//returns the proper URL for the given screen ID.
		//if forceMobile is true, or undefined AND if user is already on a mobile device, the requested screen will not contain HTML5 videos, only GIFS
		//minRating is the minimum clip rating to allow.
		var getShareURL = function(screenId, skipIntro, forceMobile, minRating) {
			//sanitize screenId 
			screenId = screenId.replace(/^\d+|\W/g, '');
		
			return "http://lsd.odbol.com/live?screen=" + encodeURIComponent(screenId) + 
					/* if master sharer is on mobile, don't allow anyone to use videos - only GIFs */
					((isMobile && forceMobile !== false) || forceMobile ? "&mobileOnly=true" : "") +
					(skipIntro ? "&skipIntro=true" : "") +
					(parseInt(minRating) > 0 ? "&rating=" + minRating : "");
		};


		//make the page smaller so there's no scrolling
		$(".waitingDesc").hide();
		
		//move whole page into holder so we can cover it/ put the background behind it.
		$("body")
			.append("<div id='realbody'><div>Loading LSD...</div></div>")
			.find("#realbody div")
				.replaceWith($("body").children(":not(#realbody, script)"));
		$("body")
			.append("<div id='backgroundHolder' class='step step_effects' title='" + TEXT_STEP_EFFECTS_HELP + "'><canvas id='backgroundCanvas' width='" + resolution.width + "' height='" + resolution.height + "'></canvas></div>");

		var renderer = new SeriousRenderer(lsd, null, 'backgroundCanvas', compositeTypes);
		if (!renderer.isSupported()) {
			renderer = new CanvasRenderer(lsd, null, 'backgroundCanvas', compositeTypes);
		}

		if (renderer.isSupported()) {
			var canvas = renderer.getCanvas();

			//disable scrolling on touch devices
			document.ontouchmove = function(e){
            	e.preventDefault();
            	return false;
			};

			var availableEffects = Seriously.effects();

			
			//filter clips list by rating and mobileOnly flag:
			minRating = minRating || 500;
			var ratingMatch = (/rating=(\d+)/).exec(window.location.href);
			if (ratingMatch && ratingMatch.length > 1)
				minRating = parseInt(ratingMatch[1]);

			//if master sharer is on mobile, don't allow anyone to use videos - only GIFs
			//remove all videos from clips list
			var removeVids = /mobileOnly=true/.test(window.location.href);

			var newVidClips = [];
			for (var i in vidClips) {
				if ( vidClips[i].rating >= minRating &&  
					!( removeVids && vidClips[i].isVideo() ) ) {
					newVidClips.push( vidClips[i] );
				}
			}
			this.vidClips = newVidClips;

		
			if (crowd) {
				crowd.init(this, minRating);
			}
		
		
			
			var compositeIndex = 0;
			compositeTypes = renderer.getBlendModes();
				
				
			//changes the clip in the given layer. TODO: this could be better	
			var changeClip = function (currentLayer, currentLayerControl, clip) {
					if (currentLayer.clip != clip) { //avoid infinite loop
						currentLayer.$el = currentLayerControl;
						currentLayer.load(clip);
					}
				},
				
				getClipThumbHTML = function getClipThumbHTML(clip, idx) {
					return "<li id='vidClip_" + idx + "' class='clipThumb' title='Choose a clip to play. Use the arrows to scroll.'><img src='" + clip.thumbnail + "' /></li>";
				},


				/***
					Binds a VidClip to the given HTML element (should be a clipThumb)
	
				***/
				attachClipToThumb = function attachClipToThumb(clip, el) {
					$(el).data("vidClip", clip); 
					clip.element = el;
				},

				/*** 
					Adds the specified VidClip to the end of the list.
				***/
				addClip = function addClip(clip) {
					var clipEl = $(getClipThumbHTML(clip, lsd.vidClips.push(clip) - 1))
						.appendTo('#clipThumbLists ul:last');

					attachClipToThumb(clip, clipEl.get(0));
				};
			
			
			lsd.addClip = addClip;

			if (!(numLayers > 0))
				numLayers = 3;
			
			//fill the layers array with our media sources 
			var layers = new Array(numLayers);
			
			var sliders = new Array(numLayers);

			var changeClipById = function(event, layerId, clipId) {
					//if (event.name
					var clip = lsd.getVidClipById(clipId);
					if ( clip ) {
						var layerControl = $("#backgroundCanvasControls .layerControl").eq(layerId);
						changeClip( layers[layerId], layerControl, clip );	
		
					}
				},
				
				numClipsLoading = 0,
				
				preloadClipById = function preloadClipById(event, clipId) {
					var clip = lsd.getVidClipById(clipId);
					if ( clip ) {
						numClipsLoading++;
						$('body').addClass('preloading');
						$('.preloaderProgress').html(numClipsLoading);
						
						
						clip.load(function (img) {
							$(lsd).trigger('preloadClipFinished.lsd', [clipId, --numClipsLoading]);
						});
					}
				},
				
				// for loading screen
				onPreloadClipFinished = function onPreloadClipFinished(event, clipId) {
					if (numClipsLoading <= 0) {
						$('body').removeClass('preloading');
					}
					
					$('.preloaderProgress').html(numClipsLoading);
				},
				
				changeLayerOpacity = function(event, layerId, val, duration) {
					//layers[layerId].opacity = val; //parseFloat(snapshot.val());
							
					//TODO: update slider val!
					sliders[layerId].tweenTo(val, duration);
				},
							
				onChangeComposition = function (event, value) {
						compositeIndex = value;
						$("#compositionSelector").val(compositeIndex);

						renderer.setBlendMode(compositeTypes[compositeIndex]);
				};

			//binds to all related events triggered by given publisher
			this.subscribeTo = function(publisher) { 
				$(publisher)
					.bind('changeClip.lsd', changeClipById)
					.bind('preloadClip.lsd', preloadClipById)
					.bind('preloadClipFinished.lsd', onPreloadClipFinished)
					//.bind('opacityStart.lsd', changeLayerOpacity)
					.bind('opacityEnd.lsd', changeLayerOpacity)	
					.bind('changeComposition.lsd', onChangeComposition);
			};
			
			this.subscribeTo(lsd);
			
			if (crowd) {
				this.subscribeTo(crowd);
			}
		
			if (typeof(shouldInitClips) === 'undefined') {
				shouldInitClips = (!crowd || crowd.screenId != 'lounge'); //workaround until get firebase to always load defaults?? TODO
			}
			for (var i = 0; i < numLayers; i++) {
				layers[i] = new VidLayer(shouldInitClips ? lsd.vidClips[i] : null, i); //the clip thumbs will be added to GUI later, during clip initialization
			
				if (shouldInitClips && compositeTypes[compositeIndex] == "lighter"
						// only show the first two images
						&& i < 2)
					layers[i].setOpacity(0.7);
				else
					layers[i].setOpacity(0.0);
				
				if (crowd) {
					crowd.makeOnClipChange(i);
					crowd.makeOnLayerChange(i);
				}
			}
				
			 //GLOBALS!
			var currentLayer = null;
			var currentLayerControl = null; //should be initialized once control panel behaviour(!) is initialized
			
			var isInteractiveMode = INTERACTIVE_MODE.OFF; //indicates if the mouse should control sliders automatically
			
			//////////////////////////////
			//BUILD HTML CONTROLS
			//////////////////////////////
			var iconsHTML = "<h1><a href='http://lsd.odbol.com' title='Click to take LSD'>LSD Visuals</a></h1><ul class='icons buttons ui-widget ui-helper-clearfix'>" +
				"<li id='buttonShare' title='Share Screen' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-link'></span></li>" +
				"<li id='buttonHelp' title='Help/About' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-help'></span></li>" +		
				"<li id='buttonFullscreen' title='Fullscreen Visuals' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-arrow-4-diag'></span></li>" +		
				(ENABLE_BACKGROUNDING ? "<li id='buttonStop' title='Stop Visuals' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-closethick'></span></li>" : "") +
				"</ul>";
				
			//build html control for composite
			var compHTML = "<select id='compositionSelector'>";
			for (i in compositeTypes) 
				compHTML += "<option value='" + i + "'>" + compositeTypes[i] + "</option>";
			compHTML += "</select>";
			
			var sliderHTML = "<div class='globalOptions'>" + 
				"<label id='interactiveToggle' style='display:none'><input type='checkbox' value='true' />Interactive Mouse Mode</label>" +
				'<div class="camModeButton dialogButton"><img class="icon" src="lsd/icons/icon-live_feed-white.png" /><span class="action">Start</span> Live Cam Feed</div>' +
				"</div>",
				effectsTabHTML = '',
				availableEffectOptionsHTML = '<option value="">(no effect)</option>';
			

			for (i in availableEffects) {

				if (i == 'mixer') continue;

				availableEffectOptionsHTML += '<option value="' + i + '">' + i + '</option>';
			}

			sliderHTML += 
				"<div id='controlTabs' class='controlTabs'><ul class='tabButtons'><li id='clipsTabButton' class='button tabButton'><a href='#clipsTab'>Clips</a></li>" +
				"<li id='effectsTabButton' class='button tabButton'><a href='#effectsTab'>Effects</a></li>" +
				"</ul>" + 
				'<div class="tabPanels"><div class="tab active" id="clipsTab">';

			sliderHTML += "<div class='layerSliders step_1' title='Drag the sliders up and down to crossfade layers'>";
			for (i in layers) {
				sliderHTML += "<div class='layerControl' id='layerControl_" + i + "'>";
				effectsTabHTML +=  "<div class='layerEffects' id='layerEffectsControl_" + i + "'><h3>Layer " + i + "</h3>";

				if (enableHTML5Range) {
					sliderHTML += "<input type='text' class='slider' data-fd-slider-vertical='vs' name='layerSlider" + i + "' id='layerSlider" + i + "' />";
					//effectsTabHTML += "<input type='text' class='slider' data-fd-slider-vertical='vs' name='layerEffectsSlider" + i + "' id='layerEffectsSlider" + i + "' />";
				}
				else {
					sliderHTML += "<div class='slider'></div>";
					//effectsTabHTML += "<div class='slider'></div>";
				}

				sliderHTML += "<div class='clipThumb' title='Click the layer icon to change its video clip'></div></div>";
				effectsTabHTML += '<div class="effectPanel"><div class="effectSelector"><select class="effectSelector">' + availableEffectOptionsHTML + '</select></div><div class="effectControls"></div></div></div>';
			}
			//sliderHTML += "</div>";
			
			sliderHTML += "<br class='clear' /><div class='sharedControls'>" + compHTML;
			
			//add video thumbs
			sliderHTML += "<div class='clipThumbs imageSlider'>" +
				"<div class='ui-widget ui-helper-clearfix'><a href='#' class='previous button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-w'>Previous</span></a><a href='#' class='next button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-triangle-1-e'>Next</span></a></div>" +
				" <div class='panelHolder'>" +
				"	<div id='clipThumbLists' class='slidingPanel'>" +
						"<ul>";
			for (i in lsd.vidClips) {
				//separate lists in pages for horizontal scrolling
				if (i > 0 && i % CLIP_PAGE_SIZE == 0) 
					sliderHTML += "</ul><ul>";

				sliderHTML += getClipThumbHTML(lsd.vidClips[i], i);
			}
			sliderHTML += "</ul></div></div>" + //end panelHolder
				//"<br class='clear' />" +
				"</div>";
		
		

		
		
		
		
			sliderHTML += "</div></div>"; //end sharedCOntrols, layerSliders

			sliderHTML += '</div><div class="tab" id="effectsTab">' + effectsTabHTML + '</div></div></div>'; // end tabPanels, #controlTabs

			 
			$("body").append("<div id='backgroundCanvasControls' class='dialogControls ui-corner-all'>" + iconsHTML +
				"<div class='aboutBox'>" + ABOUT_HTML + "</div>" +
				"<div class='controlPanel'>" + sliderHTML + "</div></div>");
		

			//////////////////////////////
			// EVENT BEHAVIORS
			//////////////////////////////

			// tabs
			/*$("#effectsTabButton, #clipsTabButton").on('click', function () {

				$('#clipsTab').toggleClass('active');
				$('#effectsTab').toggleClass('active');
			});*/
			var controlTabs = $('#controlTabs').tabs();


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
					$(lsd).trigger('changeComposition.lsd', [this.value]);						
					
					//CROWD: receive layer change events
//TODO: should this be here, or should it also subscribe to lsd.changeComposition event????					
					//crowd.setComposition(this.value);
				});
				

			
			//layer controls
			var setCurrentLayer = function (layerControlElement) { 	
				currentLayerControl = layerControlElement;			
				currentLayer = currentLayerControl.data("vidLayer");
				
				//visually toggle it
				$("#backgroundCanvasControls .layerControl").removeClass("current");
				currentLayerControl.addClass('current');
			}
			$("#backgroundCanvasControls .layerControl")
				.each(function (i, el) {	//add linkback data from tags to objects
					$(this).data("vidLayer", layers[i]); //assumes they're in the same order as the array. risky....
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
			var ALWAYS_SHOW_SHARED_CONTROLS = window.innerHeight > 460,
				isSharedControlsShown = false;
			var showSharedControls = function (e) {
					$("#backgroundCanvasControls").addClass("sharedOpen")
						.find(".sharedControls")
							.slideDown('slow');
					
					isSharedControlsShown = e.target; //holds the object that triggered the showing
				};
			var hideSharedControls = function (e) {
				if (!ALWAYS_SHOW_SHARED_CONTROLS) {
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

			if (ALWAYS_SHOW_SHARED_CONTROLS) {
				showSharedControls({target:true}); // fake out the event.
			}
			
			//layer preview thumb
			$("#backgroundCanvasControls .layerControl")
				//.toggle(, hideSharedControls)
				.on('click', '.clipThumb', function (e) {
					toggleSharedControls(e);
					setCurrentLayer($(this).parent());
				});

			//CLIP THUMBS
			$("#backgroundCanvasControls .clipThumbs .clipThumb")
				.parent()
					.on('click', '.clipThumb', function () { 		//load clip's video into current layer
						if (currentLayer) {
							var $this = $(this),
								layerId = currentLayer.id,
								clipId = $this.data("vidClip").id;
							
							//changeClip(currentLayer, currentLayerControl, $this.data("vidClip") );
	
							$(lsd).trigger('changeClip.lsd', [layerId, clipId]);
			
							
							hideSharedControls();
						}
					})
				.end()
			
				.each(function (i, el) {	//add linkback data from tags to objects
					attachClipToThumb(lsd.vidClips[i], this); //assumes they're in the same order as the array. risky....					
					//$(this).data("vidClipIdx", i); //assumes they're in the same order as the array. risky....
				})
				.slice(0, 3) //add the thumbs for the first three already-loaded clips into the layers
					.each(function (i, el) { 
						$("#layerControl_" + i).find(".clipThumb").html($(this).html() + CLIP_BUTTON_HTML); //put the current clip thumb in there.
					});
			

			
			
			//clip thumb scrolling
			var clipScroller = new ImageSlider($("#backgroundCanvasControls .clipThumbs"), 3, Math.ceil(lsd.vidClips.length / 9.0), ".clipThumb")
			
			
			//BUTTONS
			var hideControls = function () {
				$("#backgroundCanvasControls .controlPanel, #buttonHelp, #buttonStop, #backgroundCanvasControls .aboutBox").hide('fast');
					
				//$("#backgroundCanvasControls").switchClass("maximized", "minimized", 500);
				$("#backgroundCanvasControls").animate({width:"150px"}, 100);		
			};
			var maximizeControls = function () {
				$("#backgroundCanvasControls").animate({width:"400px"}, 100);
			};
			var minimizeControls = function () {
				//$("#backgroundCanvasControls").switchClass("minimized", "maximized", 500);
				$("#backgroundCanvasControls").animate({width:"187px"}, 100);
	
				$("#backgroundCanvasControls .controlPanel, #buttonHelp, #buttonStop").show('fast');
					
				$("#backgroundCanvasControls .aboutBox").hide('fast'); //about only shown in maximized!
			};
			this.hideControls = hideControls;
			this.showControls = minimizeControls;
			
			
			var isFullscreen = false,
				toggleFullscreen = function (e) {
				//toggle fullscreen
				if (isFullscreen) {
					hideControls();
					if (ENABLE_BACKGROUNDING) {
						$("#backgroundHolder").css("zIndex", 1);
					}
				}
				else {
					minimizeControls();
					$("#backgroundHolder").css("zIndex", 500);
				}
				isFullscreen = !isFullscreen;
			};

			var drawFrameIntervalId = 0;
			
			var reviveUI = function (e) {
//console.log('reviveUI', e);
				$(canvas).unbind("mousedown.lsdUIHide");
			
				$(".dialogControls").not('.permanent').fadeIn();
				
				$('body').removeClass('uiHidden');
			};
			var hideUI = function (e) {
//console.log('hideUI', e);
				$(".dialogControls").not('.permanent').fadeOut();
				
				$('body').addClass('uiHidden');
				
				$(canvas).bind("mousedown.lsdUIHide", reviveUI);
			
				/* don't quit, just hide the UI
				if (drawFrameIntervalId > 0) {
					clearInterval(drawFrameIntervalId);
					drawFrameIntervalId = 0;
					
					$("body").unbind(".lsd"); //stop all events and animation
					//TODO: garbage collection! yeah right!
					$("#backgroundHolder, #backgroundCanvasControls").hide(); //get rid of the evidence!
				}
				*/
			};
			this.hide = hideUI;
			this.show = reviveUI;
			var toggleUI = function () {
				if ($(".dialogControls").not('.permanent').eq(0).css('display') == 'none') {
					reviveUI();
				}
				else {
					hideUI();
				}
			};
			
			$("#buttonFullscreen").click(toggleUI);
			
			/*
			if (isMobile) {
				$("#buttonFullscreen").click(toggleUI);
			}
			else {
				$("#buttonFullscreen").click(toggleFullscreen);
			}
			*/
						
			$("#buttonStop").click(hideUI);
			$("#buttonHelp").toggle(function (e) {
					//$("#backgroundCanvasControls .controlPanel").hide('fast');
					maximizeControls();
					$("#backgroundCanvasControls .aboutBox").show('fast');
				}, 
				function (e) {
					minimizeControls();
					//$("#backgroundCanvasControls .controlPanel").show('fast');
				});		
			
			if (crowd) {
				$("#buttonShare").toggle(function (e) {
						var shareUrl = getShareURL(crowd.screenId, false, /mobileOnly=true/.test(window.location.href), minRating );
						$("<div id='shareOverlay' class='dialogControls'>" + 
							"<h1>Control These Visuals!</h1>" + //fine, I guess we'll dispense with the humor just this once // Join Me on LSD</h1>" + 
							"<div class='shareButtons'>" + 
								'<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(shareUrl) + '&amp;layout=button_count&amp;show_faces=false&amp;width=220&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:21px;" allowTransparency="true"></iframe>' +
							"</div>" +
							"<img src='http://qrcode.kaywa.com/img.php?d=" + encodeURIComponent(shareUrl) + "' />" +
							'<h2>lsd.odbol.com</h2>' + 
							"</div>")
							.appendTo("body")
							.click(function () {
								$("#shareOverlay").remove();
							});
							
						toggleShareLogo();
					}, 
					function (e) {
						$("#shareOverlay").remove();
						
						toggleShareLogo();
					});		
			}
			else { //no crowd
				$("#buttonShare").hide();
			}
			
			var toggleShareLogo = function () {
				var sl = $("#shareLogo");
				//toggle between top and bottom for misplaced projectors
				if (sl.length > 0) {
					if (sl.hasClass('bottom'))
						sl.addClass('top').removeClass('bottom');
					else
						sl.remove();
				}
				else {
					$(SHARE_LOGO_HTML).appendTo('body')
						.click(function () {
							toggleShareLogo();
						});
				}

				return false;
			};
			
			
			//enable keyboard control
			$(document).keyup(function (e) {
				switch(e.which) {
					case 83: //S		
					case 13: //enter
						$("#buttonShare").click();
						break;
					case 27: //Esc
					case 67: //C
						toggleUI();
						break;
					case 32: //space
					case 76: //L
						toggleShareLogo();
						break;			
				}
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
				};
				$("#backgroundCanvasControls .layerSliders .slider").each(function (i, e) {
					if (enableHTML5Range) {
						var onSlide = function (data) {
							//change local immediately, and only send final value to crowd
							layers[i].setOpacity(parseFloat(data.value));
							
							interactiveOff(); //turn interactive off if they try to change manually
						};
						
							/*
						if (i > 0) 
							slideOpts["start"] = interactiveOff;
						*/
						$(this)
							.data("vidLayer", layers[i])
							/*.attr("min", 0.0)
							.attr("max", 1.0)
							.attr("step", 0.1)*/
							.attr("value", layers[i].getOpacity())
							;//.change(onSlide);
							
						sliders[i] = fdSlider.createSlider({
						  // Associate the slider with the form element 
						  inp:this,
						  // Use the "tween to click point" animation
						  //animation:"tween",
						  // A minimum value of 5
						  min:0.0,
						  // A maximum value of 15
						  max:1.0,
						  // A step/increment of 0.2
						  step:0.1,
						  hideInput: true,
						  // Create a vertical slider
        				  vertical:true,
        				  
        				  //only allow mouse changes so we can capture the dragend event
        				  kbEnabled: false,
        				  
        				  callbacks: {
        				  	'change': [onSlide], //capture tween animations too!
							'dragend': [function (data) {
								//change local immediately, and only send final value to crowd so the rest can tween
								
//console.log(i + 'lsd opacity end: ' + data.value);								
								$(lsd).trigger('opacityEnd.lsd', [i, parseFloat(data.value) ]);

							}],
							'dragstart': [function (data) {
								//change local immediately, and only send final value to crowd so the rest can tween
								
//console.log(i + 'lsd opacity start: ' + data.value);								
								$(lsd).trigger('opacityStart.lsd', [i, parseFloat(data.value) ]);

							}]
        				  }
						});
						/**/
					}
					else { //using jquery slider UI
						var onSlide = function (event, ui) {
							var $this = $(this);
							
							//$this.data("vidLayer").opacity = parseFloat($this.slider("option", "value"));
							$(lsd).trigger('opacityEnd.lsd', [i, parseFloat($this.slider("option", "value")) ]);
						};
						
						var slideOpts = {
								slide: onSlide,
								change: onSlide,
								animate: 'fast',
								min: 0.0,
								max: 1.0,
								step: 0.1,
								orientation: 'vertical',
								value: layers[i].getOpacity()
							};
							
						if (i > 0) //turn interactive off if they try to change manually
							slideOpts["start"] = interactiveOff;
						
						$(this)
							.data("vidLayer", layers[i])
							.slider(slideOpts);
					}
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
						if (enableHTML5Range) {
							//TODO
						}
						else {
							var layerAlpha = 1.0 - (e.clientY / $(canvas).height() * 0.7); //don't let them turn it all the way down
							$("#backgroundCanvasControls .layerSliders .slider").eq(2)
								.slider("option", "value", layerAlpha);
								
							layerAlpha = (e.clientX / $(canvas).width() * 0.7) + 0.3; //don't let them turn it all the way down
							$("#backgroundCanvasControls .layerSliders .slider").eq(1)
								.slider("option", "value", layerAlpha);
								
							//$msg.html("alpha: " + layerAlpha);
						}
					}
				});
		
				renderer.addLayers(layers);
				renderer.start();








				/***********************
					EFFECTS
				***********************/


				// events for effects
				var currentInputs = [],
					currentInputsIdx = 0,

					updateInput = function updateInput(idx, value, isX) {
						var input;			

//console.log('updateInputcurrentInputs.length: ' + currentInputs.length, value);			
						if (idx < currentInputs.length && value !== false) {
							input = currentInputs[idx];

							if (input.min !== -Infinity && input.min !== undefined &&
								input.max !== Infinity && input.max !== undefined) {
 
 								// assumes inputs are always normalized between 0-1
								value = scaleRange(value, 0, 1, parseFloat(input.min), parseFloat(input.max));
							}
//console.log('updateInput: ', value);
							input.value = value;
							triggerEvent('change', input);
						} 
					},


					/************ INPUT TAB ***************/
					getInputsSelectHTML = function getInputsSelectHTML() {
						var r = '<select>',
							devs = InputDevices.getDevices();

						for (var i in devs) {
							var dev = devs[i];

							for (var j = 0 ; j < dev.getNumInputs(); j++) {
								var devName = i;

								if (Modernizr.touch && devName == 'mouse') {
									devName = 'touch';
								}

								r += '<option value="' + i + '_' + j + '">' +
									 	devName + ' ' + j + '</option>';
							}
						}

						return r + '</select>';
					},

					onInputConfigChange,
					addInputToConfigTab = function addInputToConfigTab(inputEl, effectName) {
						/*var inputConfigTab = $('#inputTab');

						if (!inputConfigTab) {
							inputConfigTab = createInputConfigTab();
						}*/

						// just swap out actual input for the input config selector, saves space. plus lazy.
		
						// only bind once
						if (!onInputConfigChange) {
							onInputConfigChange = function onInputConfigChange() {
								var val = $(this).val()
									inputIdx = val && val.length > 0 ? val.split('_')[1] : -1;

								if (inputIdx >= 0) {
									currentInputs[inputIdx] = $(this).data('inputEl');
								}
							};



							var hideInputsTab = function hideInputsTab( ev, ui ) {
									//ev.preventDefault();
									//ev.stopPropagation();
									//ev.stopImmediatePropogation();

									$('#effectsTab')
										.removeClass('inputsOn');
								};

							controlTabs.on( "tabsselect", hideInputsTab);
							$('#effectsTab').on('click', hideInputsTab);


							// disbale the Inputs tab, since it's not an actual tab!
							//controlTabs.tabs('disable', 2);
	

							$('#effectsTab')
								.on('change', '.inputConfig select', onInputConfigChange)

								// also unhide the input tab switchy thingy here
							$("<li id='inputsTabButton' class='button tabButton ui-state-default ui-corner-top'><a href='#inputsTab'>Inputs</a></li>")		
								.insertAfter('#effectsTabButton')
								.on("click", function (ev) {
									ev.preventDefault();
									ev.stopPropagation();
									//ev.stopImmediatePropogation();

									$('#effectsTab')
										.toggleClass('inputsOn');

									// switch to effects tab to show inputs
									// unfortunately this makes the input tab an actual tab, which we don't want.
									// TODO: replace all this with backbone.
									//controlTabs.tabs( "option", "active", 1 );

									return false; // don't actually switch tabs...
								});

						}

						var inputConfig = $('<div class="inputConfig">' +
												getInputsSelectHTML() + 
											'</div>')
							.prependTo($(inputEl).parents('.inputHolder'))
							.find('select')
								.data('inputEl', inputEl);

						// automatically assign the input to the next available device output
						// if (!isInputChangedManually) {
							if (currentInputsIdx >= currentInputs.length) {
								currentInputs.push(inputEl);
							}
							else {
								currentInputs[currentInputsIdx] = inputEl;
							}

							inputConfig
								.val('mouse_' + currentInputsIdx)
								.change();


							currentInputsIdx = (currentInputsIdx + 1) % InputDevices.mouse.getNumInputs();
						// }

					},

					// adds an input for manipulation later, adds to Inputs tab as well
					addInput = function addInput(inputEl, effectName) {

						addInputToConfigTab.apply(this, arguments);
					},




					/************ EFFECTS TAB ***************/

					setTabAsActive = function setTabAsActive ($effectPanel, effectName, effect, effectType) {
						var $el = $effectPanel.find('.effectControls');
							
						effect = effect || $effectPanel.data('effect');
						// need actually the effect type, not the instantiated effect, so we can parse inputs
						effectType = effectType || Seriously.effects()[effectName];

						// save these inputs for manipulation later
						$el.find('input').each(function (el, i) { // was 'input[type="number"]', but doesn't work in FF mobile.
							addInput(this, effectName);
						});
					},

					refreshEffectTab = function refreshEffectTab($effectPanel, effectName) {
						var vectorVars = ['x','y','s','t'],
							$el = $effectPanel.find('.effectControls'),
							effect = $effectPanel.data('effect'),
							// need actually the effect type, not the instantiated effect, so we can parse inputs
							effectType = Seriously.effects()[effectName],
							el = $el.get(0),
							holder,
							inputElements, input;

						$el.empty();

						if (effect && effectType) {
							for (var i in effectType.inputs) {
								input = effectType.inputs[i];

								if (input.type == 'image') continue;

								inputElements = Seriously.util.createHTMLInput(input, i, false, false); //holder.find('.input').get(0), holder.find('.label').get(0));

								// attach the form element directly to the effect's input.
								effect[i] = inputElements;

								for (var k in inputElements) {
									name = input.title || i;

									if (inputElements.length > 1) {
										name += ' ' + vectorVars[k];
									}

									holder = $("<div class='inputHolder'></div>").appendTo($el);
									holder.get(0).appendChild(inputElements[k]);

									holder.append('<label for="' + inputElements[k].id + '">' + name + '</a>');

									// ranges don't work too well with dial. turn them back to number boxes
									if (inputElements[k].type == 'range') {
 										inputElements[k].type = 'number';
 									}
								}
							} 

							var knobOpts = {
									width: 50,
									height: 50,
									angleOffset: -125,
									angleArc: 250,
									bgColor: '#660000',
									fgColor: '#cc0000',
									allowFractions: true,
									change: function () {
										// trigger change handler of original input element, WITHOUT jQUERY - needs to trigger events added with addEventListener()
										var input = this.$.get(0);
										
										triggerEvent('change', input);
									}
								};
							$el.find('input').knob(knobOpts);

							setTabAsActive($effectPanel, effectName, effect, effectType); 
						}
					};

				$('#effectsTab')
					.find('.layerEffects')
						.each(function(el, i) {
							var $this = $(this),
								layerId = $this.attr('id').replace('layerEffectsControl_', ''),
								// TODO: decide if we can actually display layers (i.e. not mobile)
								layer = renderer.getSeriousLayer && renderer.getSeriousLayer(layerId);

							if (!layer) return;

							$this.data('layer', layer);

	/*
							$this.find('.effectPanel')
								.each(function (el, i) {
									refreshEffectTab($(this));
								});
	*/
						})
					.end()
 
					.on('change', 'select.effectSelector', function () {
						var $this = $(this),
							effectName = $this.val(),
							effectPanel = $this.parents('.effectPanel'),
							layer = $this.parents('.layerEffects').data('layer'),
							effect = null;

						if (!layer) return;

						if (effectName) {
							effect = layer.setEffect(effectName);
						} 
						else {
							effect = layer.setEffect(null);
						}
						effectPanel.data('effect', effect);
						refreshEffectTab(effectPanel, effectName);

						renderer.refresh();
					})
					.on('click', 'h3', function () {
						$(this).toggleClass('open');
					});


				// this is where we init our input devices (e.g. mouse/touch, external OSC, even perhaps a LeapMotion?)
				var onInputDeviceChange = function (ev, msg) {

						var path = msg.getPathObj();
//console.log('mosue moved: ', msg);
						if (path[0] == 'mouse' && path[2] == 'xy') {
							var arrayIdx = parseInt(path[1]) * 2;
							
							// only follow mouse when they clickin
							if (arrayIdx >= 0) {
								updateInput(0 + arrayIdx, msg.value[0], true);
								updateInput(1 + arrayIdx, msg.value[1], false);
							}
						}
					},
					initInputDevices = function () {

						// mouse also handles touch events if available.
						$.each(InputDevices.getDevices(), function (i, dev) {						
							dev.start() 
								.bind('change', onInputDeviceChange);
						});

					};

				initInputDevices();


				// load some initial effects. TODO: replace this with crowd sync
				$('#effectsTab select.effectSelector').each(function (i, el) {

					switch(i) {
						case 0:
							// fall through!
						case 1:
							$(el).val('hue-saturation').change();
							break;
						case 2:
							$(el).val('vignette').change();
							break;
					}
				});


if (!renderer.areEffectsSupported()) {
	// TODO: show help text saying you can't see them, but you can still control them.
	// for now, just hide them!
	$('#effectsTabButton').hide();
} // END renderer.areEffectsSupported()) 
				/***********************
					END EFFECTS
				***********************/	





							
				
				
				if (enableBlendEffectOnClick) {
					$(canvas).bind("mousedown.lsd", function () {
						$(lsd).trigger('changeComposition.lsd', [(compositeIndex + 1) % compositeTypes.length]);
					});
				}
				
				
				toggleFullscreen();
				
				
				//hide url bar on mobile.
				//window.scrollTo(0, 1);
				
				if (isMobile) {
					$("#interactiveToggle").hide();
					
					/*
					$(window).resize(function () {
						window.scrollTo(0, 1);
					});
					*/
				}
				
				
				//show intro screen
				if (crowd && ! /skipIntro=true/.test(window.location.href) ) {
					var startNewScreen = function() {
						var newScreen = prompt("Choose a name for your screen:", crowd.screenId);
						if (newScreen && newScreen.length > 0)
							window.location.href = getShareURL(newScreen, true) + "&master=true";
						
						return false;
					};

					//CROWD
					//generate list of currently active screens
					var populateScreenList = function(limit, startAt) {
						if ( !(limit > 0) )
							limit = 5;
						if ( !(startAt > 0) )
							startAt = 1;	
					
						//get list of currently active screens
						var yesterday = Math.round((new Date()).getTime() / 1000) - 24 * 60 * 60;
						crowd.getScreens(limit, startAt, function(snapshot) {
							var listHTML = "";
							var lastPriority = startAt;
							snapshot.forEach(function(screenSnap) {
								var screenName = screenSnap.name();
								var screen = screenSnap.val();
															
								var numUsers = 0;
								if (screen.queue) {
									if (screen.queue.length) //this never works.
										numUsers = screen.queue.length;
									else { //count manually
										screenSnap.child("queue").forEach(function (userSnap) {
											if (CrowdControl.isUserOnline(userSnap.val()))
												numUsers++;
										});
									}		
								}
								
								lastPriority = screenSnap.getPriority();
									
								//don't show really old screens or screens that haven't been published
								if (!screen.activeSince || parseInt(screen.activeSince) < yesterday)
									return;
								
								//TODO: figure out if screen is mobile or not.
								
								//use rating filter of the screen
								listHTML += "<li class='dialogButton'><a href='" + getShareURL(screenName, true, false, screen.minRating) + "'>" +
									htmlEncode(screenName) + 
									"</a> (" + numUsers + " users)</li>";
							
							});	
						
							if (listHTML.length > 0) {
								if (lastPriority > startAt) { //only show more link if we got more last time.
									listHTML += "<li class='dialogButton'><a class='moreScreens' href='#'>More...</a></li>";
								}
								$("#screenList ul")
									.html(listHTML)
									.find(".moreScreens")
										.click(function () {
											$("#screenList ul")
												.html("<li class='loading'>Loading...</li>");
												
											populateScreenList(limit, lastPriority + 1);
											return false;
										});								
							}
							else {
								$("#screenList ul")
									.html("<li class='dialogButton'>No active screens found. <a href='#'>Start your own!</a></li>")
									.find('a')
										.click(startNewScreen);
							}
							$("#screenList li").click(function (e) {
								e.stopPropagation();
								window.location.href = $(this).find('a').attr('href');
							});
							
							//finally show the hidden close button, so people don't click it until they have all the choices!
							$("#intro .buttonClose").show();
						});
					};


					var closeIntro = function(ev) {
						$("#intro").remove();
						
						$(lsd).trigger('started.lsd', ['intro']);

						// do NOT return false; let it propagate so Documentationeer can have a shot at it!
						ev && ev.preventDefault();
						//return false;
					};					
					$(INTRO_HTML).appendTo('body')
						.click(closeIntro)
						.find('.buttonNew')
							.click(startNewScreen)
						.end()						
						.find('.buttonClose')
							.click(closeIntro);
							
					//hide joining the default screen		
					if (crowd.screenId == 'lounge') {
						$("#intro .buttonClose").hide();
						
						$("#intro .buttonNew")
							.hide(); //don't show until we've loaded the screen list, to quell those anxious impatient people.
						
						//just show them the screen list straight up
						$('#intro .buttonFind').hide();
						$('#intro .buttonClose').before(SCREEN_LIST_HTML);
						populateScreenList();
					}
					else { //they came for a specific screen, hide screen list in separate dialog
						$('#intro .buttonFind')
							.click(function() {
								closeIntro();
							
								//make list of currently active screens
								var closeScreenList = function() {
									$("#screenListDialog").remove();
									return false;
								};
								$(SCREEN_LIST_HOLDER_START + SCREEN_LIST_HTML + SCREEN_LIST_HOLDER_END).appendTo('body')
									//.click(closeScreenList)
									.find('.buttonClose')
										.click(closeScreenList);
									
								populateScreenList();

								return false;
							});
					}
				}
				else { // no intro screen
					
					$(lsd).trigger('started.lsd', ['noIntro']);
				}

				// we're finally done loading! that took a while...
				$('body').addClass('lsdLoaded');
				
				if (!ENABLE_BACKGROUNDING) {
					$('#realbody').hide();
				}
				
				
				//preload ALL the things!
				if (enablePreloading && (!crowd || crowd.userStatus == QUEUE_STATUS.MASTER)) {
					var curPreloadedClip = 0; //one at a time, please!
					var preloadClips = function () {
						lsd.vidClips[curPreloadedClip++].load(preloadClips);
					};
					preloadClips();
					//for (i in lsd.vidClips) {
					//	if (lsd.vidClips[i]) {
							//lsd.vidClips.load
					//	}
					//}
				}
			//});
			



				//*********** START REMOTE WEBCAMS **********
				if (window.RemoteCam) {
					var iconIdx = 0,
						onWebcamSubscribeCallback = function onWebcamSubscribeCallback(videoElementHolderId) {
							iconIdx = (iconIdx % 4) + 1; // 4 is maximum number of feeds.

							lsd.addClip(new VidClip({
									isRemoteCam:true, 
									tagId: videoElementHolderId
								}, 
								// add the ID to the end of the generic image because this is how Crowd finds the clip!
								"/lsd/icons/icon-live_feed-" + iconIdx + ".png?id=" + videoElementHolderId))
						},
						onWebcamUnsubscribeCallback = function onWebcamUnsubscribeCallback(videoElementHolderId) {
							// we can do this because the videoElementHolderId is appended to the end of the thumbnail URL
							$('#clipThumbLists ul').find('img[src$="' + videoElementHolderId + '"]').parent()
								.hide();
						},

						webcam = new RemoteCam(onWebcamSubscribeCallback, onWebcamUnsubscribeCallback);

					if (webcam.canPublish) {
						$('.camModeButton').click(function () {
							var $this = $(this);
							
							if ($this.hasClass('enabled')) {
								webcam.unpublish();

								$this.removeClass('enabled');

								$this.hide() // since TokBox can't really republish easily.
							}
							else {
							
								if (confirm('This will send live video from your ' +
											(isMobile ? 'phone camera' : 'webcam') +
											' to be remixed in LSD. Please click "Allow" when prompted.')) {

									webcam.publish();

									$this.addClass('enabled');
								}
							}

							return false;
						})
							.css('display', 'block'); // unhide!
					}
				}

				//*********** END REMOTE WEBCAMS **********






			
				//auto hide on mouse idle
				var lastMouseMovement = new Date(),
					idleCheckInterval = false,
					checkMouseIdle = function () {
						if (lastMouseMovement.getTime() < new Date().getTime() - 2000) {
//	console.log('checkMouseIdle');	
							lsd.hide();
							clearInterval(idleCheckInterval);
							idleCheckInterval = false;
						}
					},
					startMouseIdle = function startMouseIdle(ev) {
//console.log('startMouseIdle', ev.target, this);		
						if (ev.target != this && 
							!(this == window && ev.target.id == 'backgroundCanvas')) return	true;
					
						if (!idleCheckInterval) {
							lsd.show();
							idleCheckInterval = setInterval(checkMouseIdle, 2000);
						}				
						lastMouseMovement = new Date();
					},
					cancelMouseIdle = function cancelMouseIdle(ev) {
//console.log('cancelMouseIdle', ev.target);					
						clearInterval(idleCheckInterval);
						idleCheckInterval = false;
					};
				$('canvas').mousemove(startMouseIdle)
					.mouseout(cancelMouseIdle);
/* omg crhome is retsrded 
				$(window)
					.on('mouseenter.win', cancelMouseIdle)
					.on('mouseout.win', startMouseIdle); 
			*/
			
			//return an object they can play around with
			/*return {
				crowd: crowd,
				vidClips : vidClips,
				getVidClipById : getVidClipById
			};
			*/
		}
		else { //HTML5 fail!
			$("#backgroundHolder").prepend(HTML_ERROR_NOT_SUPPORTED);
				//ERROR_MSG_HTML_START + "Sorry! Your browser isn't strong enough to take LSD.<br /><br />" + REQUIREMENTS_HTML + ERROR_MSG_HTML_END);

			//return false;
		}
		
		
		return this;	
	}
  };
	
	//installs and runs LSD in the background of your page content
	$.fn.takeLSD = function() {
		var lsd = new LSD();
		return lsd.init.apply(lsd, arguments);
	}
   
			

})( jQuery );
//});