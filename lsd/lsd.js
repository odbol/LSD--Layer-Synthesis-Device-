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

const LICENSE_HTML = '<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/80x15.png" /></a>'; //<br /><span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/InteractiveResource" property="dc:title" rel="dc:type">LSD (Layer Synthesis Device)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com" property="cc:attributionName" rel="cc:attributionURL">odbol</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.<br />Based on a work at <a xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://odbol.com/lsd" rel="dc:source">odbol.com</a>.'
const REQUIREMENTS_HTML = "<p>Supported on Firefox 3.5+, Safari 4+, Chrome, iPhone, Android (no IE, what a surprise...)</p>"
const ABOUT_HTML = "<h2>LSD (Layer Synthesis Device)</h2><h3>VJing in HTML5</h3>" +
			"<p>Use LSD to VJ live video on the web! Choose video clips and images and blend them together using the mixer controls " +
			"or the interactive mouse mode. Create your customized hallucination directly in your browser and share with your friends!</p>" +		
			"<h4>Layers</h4>" + 
			"<p>You can control the mixing of the layers with the sliders below.<br />" +
			"Click the layer's thumbnail to choose a different video and blend mode.</p>" +
			"<h4>Keyboard Controls</h4>" + 
			"<p><strong>S or Space</strong>: Show the QR code for screen sharing.<br />" +
			"<strong>C or Esc</strong>: Hide all controls and windows.<br />" + 
			"<strong>SHIFT (hold)</strong>: temporarily activate interactive mouse mode.<br />" + 
			"Click the mouse to change the blend mode.</p>" +
			"<h4>About</h4>" +
			REQUIREMENTS_HTML + 
			"<p>Code and video content by <a href='http://odbol.com'>odbol</a>, 2010&nbsp;" + LICENSE_HTML + "<br />GIFs by <a href='http://lcky.tumblr.com/' target='_blank'>Adam Harms</a>, <a href='http://dvdp.tumblr.com/' target='_blank'>David Ope</a>, and unknown sources.</p>"
const ERROR_MSG_HTML_START = 
'		<div class="ui-widget">' +
'			<div class="ui-state-error ui-corner-all" style="padding: 0 .7em;"> ' +
'				<p><span class="ui-icon ui-icon-alert" style="float: left; margin-right: .3em;"></span> ' +
'				<strong>Error:</strong> '

const ERROR_MSG_HTML_END = '</p>' +
'			</div>' +
'		</div>	'

const CLIP_BUTTON_HTML = '<div class="button ui-state-default ui-corner-bottom"><span class="ui-icon ui-icon-triangle-1-s"></span></div>'
		
		
const INTRO_HTML = '<div id="intro" class="dialogControls">' +
		'<h2>You are now on LSD</h2>' +
		'<p>LSD is a collaborative VJ app. Everyone controls the same screen!</p>' +
		'<p class="tips">Use the red sliders on the right to mix videos.<br />' +
		'Click the thumbnails to change the videos.</p>' +
		//'<p><label for="e">Your Name:</label> <input type="text" id="vjName" name="vjName" value="VJ Default" /></p>' +
		'<a class="button buttonClose" href="#">Join this screen</a><br />' +
		'<a class="button buttonNew" href="#">Start your own screen</a><br />' +
		'</div>';
					
const DRAW_FRAMERATE = 33;
const INTERACTIVE_MODE = {OFF: 0, ON: 1, TOGGLED: 2}; //enum for isInteractiveMode

const CLIP_PAGE_SIZE = 9

//if true, the blending effect will change when you click anywhere on the canvas (doesn't work so well on mobile)
var enableBlendEffectOnClick = !isMobile;

//range input sliders don't work in firefox.
//jQuery sliders don't work in mobile. what's a dev to do? BOOLEAN THAT SHIT
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
VidLayer.prototype.load = function (clip) {
	this.clip = clip;
	//this.image = null; 
	var parentLayer = this;
	clip.load(function (loadedImage) {
		if (clip != parentLayer.clip) //this callback is late, the layer has already moved on to another clip so don't load the old one! (happens on startup)
			return;
	
		if (parentLayer.image != null) { //unload (hide) last vid, for performance (don't want a billion GIFs running at once)
			parentLayer.image.style.display = 'none';
			
			if (parentLayer.image.pause) //stop last video, if it is
				parentLayer.image.pause();
		}
		
		parentLayer.image = loadedImage;
		
		loadedImage.style.display = 'block'; //make sure the image is now shown again if it was hidden before
		
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
function VidLayer(clip, id) {
	if (clip)
		this.load(clip);
		
	this.id = id;
	return this;
}  


(function( $ ){
//$(function(){

	//sanitizes any text for insertion as HTML
	function htmlEncode(value){
	  return $('<div/>').text(value).html();
	}

	//installs and runs LSD in the background of your page content
	//	vidClips		-	array of vidClips for clip library. the first numLayers will be loaded into layer.
	//	compositeTypes	-	optional array of globalCompositeOperation types to use (default: all)
	//	numLayers		-	optional number of layers to initalize (default 3 recommended)
	//  userId			-	NOT optional id of user - alphanumeric only.
   $.fn.takeLSD = function(vidClips, compositeTypes, numLayers, userId) {
		
		//returns the proper URL for the given screen ID.
		//if forceMobile is true, or if user is already on a mobile device, the requested screen will not contain HTML5 videos, only GIFS
		var getShareURL = function(screenId, forceMobile) {
			return "http://odbol.com/lsd.php?screen=" + screenId + 
					/* if master sharer is on mobile, don't allow anyone to use videos - only GIFs */
					(isMobile || forceMobile ? "&mobileOnly=true" : "");
		};


		//make the page smaller so there's no scrolling
		$(".waitingDesc").hide();
		
		//move whole page into holder so we can cover it/ put the background behind it.
		$("body")
			.append("<div id='realbody'><div>Loading LSD...</div></div>")
			.find("#realbody div")
				.replaceWith($("body").children(":not(#realbody, script)"));
		$("body")
			.append("<div id='backgroundHolder'><canvas id='backgroundCanvas' width='320' height='240'></canvas></div>");

		var canvas = document.getElementById('backgroundCanvas');
		if (canvas.getContext){
			//disable scrolling on touch devices
			document.ontouchmove = function(e){
            	e.preventDefault();
            	return false;
			};

			//get user id
			var lsdUserId = window.localStorage.getItem("lsdUserId");
			if ( !lsdUserId )
				lsdUserId = prompt("Please enter your VJ name:", userId);
	
			if ( lsdUserId ) {
				userId = lsdUserId;
				window.localStorage.setItem("lsdUserId", userId);
			}
			
			//INITIATE CROWD CONTROL
			var fireBaseRoot = 'http://gamma.firebase.com/gif_jockey';
			
			var screenId = null;
			var screenIdMatch = (/screen=([^&]+)/).exec(window.location.href);
			if (screenIdMatch && screenIdMatch.length > 1)
				screenId = screenIdMatch[1];
			if (!screenId)
				screenId = 'lounge';
			fireBaseRoot += '/' + screenId;
		
			var userStatus = QUEUE_STATUS.OFFLINE;
			//var fireRef = new Firebase('http://angelhack.firebase.com/gif_jockey');
			var presenceRef = new Firebase(fireBaseRoot + '/queue/' + userId + '/online');
			
			//Make sure if I lose my connection I am marked as offline.
			presenceRef.setOnDisconnect(QUEUE_STATUS.OFFLINE);
			//Now, mark myself as online.
			presenceRef.setWithPriority(QUEUE_STATUS.WAITING, QUEUE_STATUS.WAITING);
		
			//keep track of status in queue
			presenceRef.on('value', function(snapshot) {
			  if(snapshot.val() === null) {
				console.log('User does not exist.');
				userStatus = QUEUE_STATUS.OFFLINE;
			  } else {
				userStatus = snapshot.val();
			  }
			});
		
			//immediately start
			if ((/master=true/).test(window.location.href)) //TODO: check other users in queue if you're first
				presenceRef.setWithPriority(QUEUE_STATUS.MASTER, QUEUE_STATUS.MASTER);
			else
				presenceRef.setWithPriority(QUEUE_STATUS.PLAYING, QUEUE_STATUS.PLAYING);
			
			
			//make users list
			$("body").append("<div id='userList' class='dialogControls'><h1>VJs Online</h1><br class='clear' /><ul></ul></div>");

			var usersRef = new Firebase(fireBaseRoot + '/queue/');
			usersRef.on('value', function(snapshot) {
			  var users = snapshot.val();
			  var userHTML = "";
			  var offlineUserHTML = "";
			  
			  if(users) {
				$.each(users, function (i, u) {
					var liHTML = "<li class='status_" + escape(u.online);
					if (i == userId)
						liHTML += " self"; 
					liHTML += "'>" + htmlEncode(i) + "</li>";
					
					//build list in reverse
					if (u.online == QUEUE_STATUS.OFFLINE || parseInt(u.online) == QUEUE_STATUS.OFFLINE)
						offlineUserHTML = liHTML + offlineUserHTML;
					else
						userHTML = liHTML + userHTML;
				});
			  }
			  
			  //keep offline users last (since priorty sort doesn't really work that well)
			  $("#userList ul").eq(0).html(userHTML + offlineUserHTML);
			});
		
			
			//if master sharer is on mobile, don't allow anyone to use videos - only GIFs
			//remove all videos from clips list
			if ( /mobileOnly=true/.test(window.location.href) ) {
				var newVidClips = [];
				for (var i in vidClips) {
					if ( !vidClips[i].isVideo() ) {
						newVidClips.push( vidClips[i] );
					}
				}
				vidClips = newVidClips;
			}
		
		
		
			var ctx = canvas.getContext('2d');
			
			var compositeIndex = 0;
			if (!compositeTypes)
				compositeTypes = ['lighter','darker','copy','xor',
				  'source-over','source-in','source-out','source-atop',
				  'destination-over','destination-in','destination-out','destination-atop'
				];
				
				
			//changes the clip in the given layer. TODO: this could be better	
			var changeClip = function (currentLayer, currentLayerControl, clip) {
				currentLayer.load(clip);
				currentLayerControl.find(".clipThumb").html($(clip.element).html() + CLIP_BUTTON_HTML); //put the current clip thumb in there.
			};
			
			
			if (!(numLayers > 0))
				numLayers = 3;
			
			//fill the layers array with our media sources 
			var layers = new Array(numLayers);
			
			var sliders = new Array(numLayers);
			
			
			//CROWD CONTROL
			
			var makeOnClipChange = function (layerId) {
				//CROWD: receive layer change events
				var clipRef = new Firebase(fireBaseRoot + '/layers/' + layerId + '/clip');
				clipRef.on('value', function(snapshot) {
					//var layerId = parseInt(clipRef.parent().name());
					var clipId = snapshot.val();
					
					//find clip and see if it's changed
					if (clipId) {
						var clip = null;
						for (var j in vidClips) {
							if ( vidClips[j].id == clipId ) {
								var layerControl = $("#backgroundCanvasControls .layerControl").eq(layerId);
								changeClip( layers[layerId], layerControl, vidClips[j] );	
								
								break;
							}
						}
					}
				});
			};
			
			var makeOnLayerChange = function (layerId) {
				//CROWD: receive layer opacity change events
				var clipRef = new Firebase(fireBaseRoot + '/layers/' + layerId + '/opacity');
				clipRef.on('value', function(snapshot) {
					var val = snapshot.val();
					if (val >= 0) {
						//layers[layerId].opacity = val; //parseFloat(snapshot.val());
						
						//TODO: update slider val!
						sliders[layerId].tweenTo(val);
					}
				});
			};
			
		
		
		
			for (var i = 0; i < numLayers; i++) {
				layers[i] = new VidLayer(vidClips[i], i); //the clip thumbs will be added to GUI later, during clip initialization
			
				if (compositeTypes[compositeIndex] == "lighter")
					layers[i].opacity = 0.7;
					
				makeOnClipChange(i);
				makeOnLayerChange(i);
			}
				
			 //GLOBALS!
			var currentLayer = null;
			var currentLayerControl = null; //should be initialized once control panel behaviour(!) is initialized
			
			var isInteractiveMode = INTERACTIVE_MODE.OFF; //indicates if the mouse should control sliders automatically
			
			//////////////////////////////
			//BUILD HTML CONTROLS
			//////////////////////////////
			var iconsHTML = "<h1><a href='http://odbol.com/lsd' title='Click to take LSD'>LSD Visuals</a></h1><ul class='icons buttons ui-widget ui-helper-clearfix'>" +
				"<li id='buttonShare' title='Share Screen' class='button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-link'></span></li>" +
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
			for (i in layers) {
				sliderHTML += "<div class='layerControl' id='layerControl_" + i + "'>";
				if (enableHTML5Range)
					sliderHTML += "<input type='text' class='slider' data-fd-slider-vertical='vs' name='layerSlider" + i + "' id='layerSlider" + i + "' />"
				else
					sliderHTML += "<div class='slider'></div>";
				
				sliderHTML += "<div class='clipThumb'></div></div>";
			}
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
			
			$("body").append("<div id='backgroundCanvasControls' class='dialogControls ui-corner-all'>" + iconsHTML +
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
					compositeIndex = this.value;
					
					//CROWD: receive layer change events
					var clipRef = new Firebase(fireBaseRoot + '/composition');
					clipRef.set( this.value );
				});
				
			//CROWD: receive layer change events
			var compRef = new Firebase(fireBaseRoot + '/composition');	
			compRef.on('value', function(snapshot) {
					var val = snapshot.val();
					if (val >= 0) {
						compositeIndex = val;
						$("#compositionSelector").val(compositeIndex);
					}
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
					vidClips[i].element = this;
					//$(this).data("vidClipIdx", i); //assumes they're in the same order as the array. risky....
				})
				.click(function () { 		//load clip's video into current layer
					if (currentLayer) {
						var $this = $(this);
						
						//changeClip(currentLayer, currentLayerControl, $this.data("vidClip") );
						
						hideSharedControls();
						
						
						//CROWD: send event
						//console.log('changing clip on layer ' + fireBaseRoot + '/layers/' + currentLayer.id + '/clip' + " to " + $this.data("vidClip").id );
						var clipRef = new Firebase(fireBaseRoot + '/layers/' + currentLayer.id + '/clip');
						clipRef.set( $this.data("vidClip").id );
					}
				})
				.slice(0, 3) //add the thumbs for the first three already-loaded clips into the layers
					.each(function (i, el) { 
						$("#layerControl_" + i).find(".clipThumb").html($(this).html() + CLIP_BUTTON_HTML); //put the current clip thumb in there.
					});
			
			
			
			
			
			//clip thumb scrolling
			var clipScroller = new ImageSlider($("#backgroundCanvasControls .clipThumbs"), 3, Math.ceil(vidClips.length / 9.0), ".clipThumb")
			
			
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
					$("#backgroundCanvasControls .controlPanel, #buttonHelp, #buttonStop").show('fast');
					$("#backgroundHolder").css("zIndex", 500);
				}
				isFullscreen = !isFullscreen;
			});
			var drawFrameIntervalId = 0;
			
			var reviveUI = function () {
				$(canvas).unbind("mousedown.lsdUIHide");
			
				$(".dialogControls").fadeIn();
			};
			var hideUI = function (e) {
				$(".dialogControls").fadeOut();
				
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
			var toggleUI = function () {
				if ($(".dialogControls").eq(0).css('display') == 'none') {
					reviveUI();
				}
				else {
					hideUI();
				}
			};
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
			
			
			$("#buttonShare").toggle(function (e) {
					var shareUrl = getShareURL(screenId, /mobileOnly=true/.test(window.location.href) );
					$("<div id='shareOverlay' class='dialogControls'>" + 
						"<h1>Control These Visuals!</h1>" + //fine, I guess we'll dispense with the humor just this once // Join Me on LSD</h1>" + 
						"<div class='shareButtons'>" + 
							'<iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(shareUrl) + '&amp;layout=button_count&amp;show_faces=false&amp;width=220&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:21px;" allowTransparency="true"></iframe>' +
						"</div>" +
						"<img src='http://qrcode.kaywa.com/img.php?d=" + encodeURIComponent(shareUrl) + "' />" +
						
						"</div>")
						.appendTo("body")
						.click(function () {
							$("#shareOverlay").remove();
						});
				}, 
				function (e) {
					$("#shareOverlay").remove();
				});		
			
			
			//enable keyboard control
			$(document).keyup(function (e) {
				switch(e.which) {
					case 83: //S
					//case 13: //enter
					case 32: //space
						$("#buttonShare").click();
						break;
					case 27: //Esc
					case 67: //C
						toggleUI();
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
				//CROWD: receive layer change events
				var sendChangeOpacity = function(layerId, opacity) {
					var clipRef = new Firebase(fireBaseRoot + '/layers/' + layerId + '/opacity');
					clipRef.set( opacity );
				};
				
				
				var interactiveOff = function () { //turn interactive off if they try to change manually
					$("#interactiveToggle input").attr("checked", false).change();
				};
				$("#backgroundCanvasControls .layerSliders .slider").each(function (i, e) {
					if (enableHTML5Range) {
						var onSlide = function (data) {
							//change local immediately, and only send final value to crowd
							layers[i].opacity = parseFloat(data.value);
							
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
							.attr("value", layers[i].opacity)
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
								//CROWD
								sendChangeOpacity(i, parseFloat(data.value) );
							}]
        				  }
						});
						/**/
					}
					else { //using jquery slider UI
						var onSlide = function (event, ui) {
							var $this = $(this);
							
							//$this.data("vidLayer").opacity = parseFloat($this.slider("option", "value"));
							
							sendChangeOpacity(i, parseFloat($this.slider("option", "value")) );
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
				
				if (enableBlendEffectOnClick) {
					$(canvas).bind("mousedown.lsd", function () {
						compositeIndex = (compositeIndex + 1) % compositeTypes.length;
						$("#compositionSelector").val(compositeIndex);
					});
				}
				
				
				$("#buttonFullscreen").click();
				
				
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
				if (! /skipIntro=true/.test(window.location.href) ) {
					var closeIntro = function() {
						$("#intro").remove();
						return false;
					};
					$(INTRO_HTML).appendTo('body')
						.click(closeIntro)
						.find('.buttonNew')
							.click(function() {
								var newScreen = prompt("Choose a name for your screen:", screenId);
								if (newScreen && newScreen.length > 0)
									window.location.href = getShareURL(newScreen) + "&skipIntro=true";
								
								return false;
							})
						.end()
						.find('.buttonClose')
							.click(closeIntro);
				}
				
				//preload ALL the things!
				if (enablePreloading && userStatus == QUEUE_STATUS.MASTER) {
					var curPreloadedClip = 0; //one at a time, please!
					var preloadClips = function () {
						vidClips[curPreloadedClip++].load(preloadClips);
					};
					preloadClips();
					//for (i in vidClips) {
					//	if (vidClips[i]) {
							//vidClips.load
					//	}
					//}
				}
			//});
		}
		else { //HTML5 fail!
			$("body").prepend(ERROR_MSG_HTML_START + "Sorry! Your browser isn't strong enough to take LSD.<br /><br />" + REQUIREMENTS_HTML + ERROR_MSG_HTML_END);
		}
	}	

})( jQuery );
//});