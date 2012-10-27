/***
	Music Video Player
	
	Creates an audio track and triggers LSD events during parts of the audio.
	
	Requirements: popcorn.js
				  Layer Synthesis Device
	
	Copyright 2012 Tyler Freeman
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
***/

// number of seconds ahead of time to preload a clip before it's cued up. not really a const, may be changed for HD videos
var	PRELOAD_DELAY = 10;

(function( $ ){

	var MUSIC_CONTROLS = "<div id='musicControls' class='dialogControls'><ul class='icons buttons ui-widget ui-helper-clearfix'><li id='playButton' class='play button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-play'>Play</span></li><li id='recordButton' class='record button dialogButton step_0' title='Remix the video while watching it'>Remix</li></ul>",
		MUSIC_CONTROLS_END = '</div><div class="preloaderMsg dialogControls permanent"><img src="/lsd/blackSpinner.gif" alt="" />Loading <span class="preloaderProgress"></span> clips...</div>',

		FIREBASE_ROOT_BASE = 'http://gamma.firebase.com/lsd/_playlists';


	/**
		the storage for playlists
	**/
	var PlaylistRepo = function() {
		
	};
	
	PlaylistRepo.prototype = {
		fireBaseRoot : FIREBASE_ROOT_BASE,
		
		init : function () {
			var screenIdMatch = (/playlist=([^&#]+)/).exec(window.location.href);
			if (screenIdMatch && screenIdMatch.length > 1)
				this.playlistId = screenIdMatch[1];
			else {
				// querystring didn't work, try the url rewritten version
				screenIdMatch = (/\/\w+\/\w+\/([^?&#\/]+)/).exec(window.location.href);
				
				if (screenIdMatch && screenIdMatch.length > 1)
					this.playlistId = screenIdMatch[1];
			}
			if (!this.playlistId)
				this.playlistId = '-IdbRBMiOXdWRUD334BS';
			this.fireBaseRoot += '/' + this.playlistId;
			
			
			return this;
		},
		
		getPlaylists : function getPlaylists(callback, limit, startAt) {
			var screensRef = new Firebase(FIREBASE_ROOT_BASE);
			screensRef.startAt(startAt).limit(limit); //only get active screens (non-active are null/0)
			screensRef.once('value', callback);
		},
	
		getPlaylist : function(callback, playlistId) {
			playlistId = playlistId || this.playlistId;
			
			var screensRef = new Firebase(FIREBASE_ROOT_BASE + '/' + playlistId);
			screensRef.once('value', function (snapshot) {
				callback(snapshot.val());
			});
		},
		
		/***
		 	Saves a playlist.
		 	
		 	@param onSaved {Function(error, playlistId)} - callback
		***/
		setPlaylist : function (playlist, onSaved) {
			var self = this,
				clipRef = new Firebase(FIREBASE_ROOT_BASE),
				playlistRef = clipRef.push( playlist, function (isSaved) {
					if (isSaved) {
						self.playlistId = playlistRef.name();
					}
					
					onSaved && onSaved(isSaved ? false : 'Could not save', self.playlistId);
				});
				
			
		}
	};




	/**
		opacity timeline items
	
		Creates timeline opacity change in the DOM from given playlist item
	**/
	var OpacityItem = function OpacityItem(timeline, item) {
		var event = item.event,
			left = (item.time / this.totalTime) * 100, //* this.width;// percents don't work well in chrome
			height = event.opacity * 100.0,
			width = event.duration ? (event.duration / timeline.totalTime) * timeline.width : 5,
			delta = event.startOpacity ? event.startOpacity - event.opacity : 0,
			cssClass = delta > 0 ? "down" : "up"; 
				
		if (height < 10 && event.startOpacity >= 0) {
			height = event.startOpacity * 100.0;
		}
	
		this.$el = $('<div id="timelineItem_' + item.idx + '"class="layerOpacity ' + cssClass + '"></div>')
			.css('height', Math.round(height) + '%')
			.css('width', Math.round(width) + 'px')
			;//.css('borderTopLeftRadius', (width - 10) + 'px');
			
		this.item = item;
	};
	// static : gets 
	OpacityItem.svg = null;
	OpacityItem.init = function init(timeline) {
		/*OpacityItem.width = $("#timeline").width();
		OpacityItem.height = $("#timeline").height();
		OpacityItem.offset = $("#timeline").height()
				
		OpacityItem.svg = Raphael($("#timelineHolder") 320, 200);*/
	};
	OpacityItem.prototype = {
		$el : null,
		
		//this item's rapheael object belonging to container layer
		svg : null,
		
		render : function render() {
			var parent = this.$el.parent();
			
			if (!this.svg) {
				this.svg = parent.data('svg');
				
				if (!this.svg) {
					this.svg = Raphael(parent.get(0), parent.width(), parent.height());
					parent.data('svg', this.svg);
				}
			}
			
			var event = this.item.event,
				left = (this.item.time / this.totalTime) * 100, //* this.width;// percents don't work well in chrome
				endTop = startTop = event.opacity * 100.0,
				width = event.duration ? (event.duration / timeline.totalTime) * timeline.width : 5,
				delta = event.startOpacity ? event.startOpacity - event.opacity : 0,
				cssClass = delta > 0 ? "down" : "up"; 
				
			if (event.startOpacity >= 0) {
				startTop = event.startOpacity * 100.0;
			}
			else {
				console.log('WARNING: got event with no startOpacity ' + this.item.idx);
			}
			
			this.$el.css('height', '100%');
			
			$('<div id="timelineItem_' + this.item.idx + '_start" class="layerOpacityNode start"></div>')
				.appendTo(this.$el)
				.css('bottom', startTop + '%');
				
			$('<div id="timelineItem_' + this.item.idx + '_end" class="layerOpacityNode end"></div>')
				.appendTo(this.$el)
				.css('bottom', endTop + '%');
		}
	};





	/**
		the timeline gui
	**/
	var Timeline = function(lsd, totalTime, songAttribution) {
		var timeline = this,
			layersHTML = '';
		for (var i = 0; i < 3; i++) {
			layersHTML += '<div id="timelineLayer_' + i + '" class="timelineLayer"></div>';
		}
	
		$('#musicControls').append('<div id="timeline">' + "<ul class='icons buttons ui-widget ui-helper-clearfix'><li id='deleteButton' class='delete button ui-state-default ui-corner-all'><span class='deleteMsg'>Drag here to delete</span><span class='ui-icon ui-icon-trash'>Delete</span></li>" + //<li id='saveButton' class='save button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-disk'>Save</span></li>" 
			"<li id='zoomInButton' class='zoomIn button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-zoomin'>Zoom In</span></li><li id='zoomOutButton' class='zoomOut button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-zoomout'>Zoom Out</span></li>" + 
			'</ul><div class="scrollHolder"><div id="timelineHolder"><div id="playhead"></div><div id="timelineLayers">' + layersHTML + '</div></div></div></div>')
			.children('.buttons')
				.append("<li id='shareRButton' class='share button dialogButton'>Share</li>");
		
		$('#zoomInButton').click(function () {
			timeline.zoomIn();
		});
		
		$('#zoomOutButton').click(function () {
			timeline.zoomOut();
		});
		
		$( "#deleteButton" ).droppable({
			activeClass: "ui-state-active",
			hoverClass: "ui-state-hover",
			drop: function( event, ui ) {
				var idx = parseInt(ui.draggable
								.attr('id').replace('timelineItem_', ''));
console.log("removing item " + idx);				
				if (idx > 0) 
					timeline.remove(timeline.playlist[idx]);
					
				// just in case
				$('#timeline').removeClass('dragging');
			}
		});
		
		// let them drag LSD clips to the timeline. OO? Where we're going we don't need OO.
		/*
		$( "#backgroundCanvasControls .clipThumbs .clipThumb" ).draggable({ 
			revert: true,
			helper: "clone"
		});
		
		$( ".timelineLayer" ).droppable({
			activeClass: "ui-state-active",
			hoverClass: "ui-state-hover",
			drop: function( event, ui ) {
				var idx = parseInt(ui.draggable
								.attr('id').replace('timelineItem_', ''));
console.log("removing item " + idx);				
				if (idx > 0) 
					timeline.remove(timeline.playlist[idx]);
					
				// just in case
				$('#timeline').removeClass('dragging');
			}
		});
		*/
		
		
		this.lsd = lsd;
		this.totalTime = totalTime;
		this.songAttribution = songAttribution;
		
		this._playlistRepo = new PlaylistRepo().init();
		
		OpacityItem.init(this);
	};
	
	Timeline.prototype = {	
		ZOOM_AMOUNT : 300,
		ZOOM_MIN :  $('#timeline').width(),
		ZOOM_MAX : 12000,
		
		totalTime : 0,
		width : 0,
		songAttribution : new Attribution(),
		
		// true when there are changes that need saving
		isDirty : false,
		
		//reference to LSD
		lsd : null,
		
		//keeps track of all events from LSD during recording for later playback.
		playlist : [],
		
		setTotalTime : function setTotalTime(totalTime) {
			this.totalTime = totalTime; 
			
			//TODO: reset all clip positions if playlist != null
		},
		
		clearPlaylist : function clearPlaylist() {
			this.playlist = [];
			$('#timeline .timelineLayer').each(function () {
				$(this).empty();
			});
			
			
			$(this).trigger('cleared.timeline', [this.playlist]);
		}, 
		
		load : function load() {
			var that = this;
			
			this._playlistRepo.getPlaylist(function (song) {
				that.loadPlaylist(song.playlist);
				
				$(that).trigger('playlistLoaded.timeline', [that.playlist]);
			});
		},
		
		loadPlaylist : function loadPlaylist(playlist) {
			this.clearPlaylist();
			for (var i = 0; i < playlist.length; i++) {
				this.add(playlist[i]);
			}
			
			// reset since add() makes things dirty
			this.isDirty = false;
		},
		
		render : function render(item) {
			var timeline = this,
				opacityItem = null,
				event = item.event,
				left = (item.time / this.totalTime) * 100;//* this.width;// percents don't work well in chrome
		
			this.width = $('#timelineHolder').width();
					
			switch (event.type) {
				case 'clip':	
					var clip = this.lsd.getVidClipById(event.clipId);
						
					item$el = $('<div id="timelineItem_' + item.idx + '" class="clipThumb"><img src="' + clip.thumbnail + '" /></div>');
				break;
				case 'layer':
					opacityItem	= new OpacityItem(timeline, item);
					item$el = opacityItem.$el;
				break;
				case 'composition':	
					item$el = $('<div id="timelineItem_' + item.idx + '"class="composition"><span>' + event.composition + '</span></div>');
				break;
			}
			
			if (item$el) {
				item$el
						.appendTo('#timelineLayer_' + event.layerId)
						.css('left', Math.round(left) + '%')
						//.data('timelineItem', item)
						
						//start draggables
						.draggable({ 
							containment: "#timeline", 
							scroll: false, 
							snap: ".timelineLayer, .delete",
							snapMode: 'inner',
							stop: timeline.makeOnDragStop(timeline, item$el, item),
							start: timeline.onDragStart
						});
						
				if (opacityItem) {
					opacityItem.render();
				}
			}
		},
		
		onDragStart : function onDragStart() {
			$('#timeline').addClass('dragging');
		},
		
		//returns an event handler for dropping the timeline item.
		makeOnDragStop : function makeOnDragStop(timeline, item$el, item) {
				return function (e, ui) {
					var parent = item$el.parent();
					
					if (parent.hasClass('delete')) {
						timeline.remove(item);
					}
					else {
						var left = item$el.position().left,
							layerId = parseInt(parent
								.attr('id').replace('timelineLayer_', ''));
						
						//find total time from PIXELS, not percent as it is set originally
						item.time = (left / $('#timelineHolder').width()) * timeline.totalTime;
						item.event.layerId = layerId;
						
	console.log('ondragstop: ', item.idx, item.time, layerId);
						
						timeline.update(item);
					}
					
					$('#timeline').removeClass('dragging');
				};
		}, 
		
		unrender : function unrender(item) {
			$('#timelineItem_' + item.idx)
				.draggable("destroy")
				.unbind()
				.remove();
		},
		
		redraw : function redraw(item) {
			this.unrender(item);
			this.render(item);
		},
		
		redrawAll : function redrawAll() {
			for (var i = 0; i < this.playlist.length; i++) {
				this.redraw(this.playlist[i]);
			}
		},
		
		add : function add(item) {			
			item.idx = this.playlist.push(item) - 1;
			
			this.isDirty = true;
			
			this.render(item);
						
			$(this).trigger('added.timeline', [item]);
		},
		
		update : function update(item) {		
			this.isDirty = true;
			
			//updating don't work right with popocorn - need to clear all and re-add	
			this.remove(item);
			this.add(item);
			
			$(this).trigger('updated.timeline', [item]);
		},
		
		remove : function remove(item) {		
			// do trigger first since that event item will have an old index.	
			$(this).trigger('removed.timeline', [item]);
			
			this.playlist.splice(item.idx, 1);
			
			this.unrender(item);
					
			// redraw all for now since we need to re-index all the items and change their idx property.
			this.loadPlaylist(this.playlist);
		
			// since loadPlaylist() marks as not dirty.
			this.isDirty = true;
		},
		
		save : function save(author, callback) {
			if (this.isDirty) {	
				this._playlistRepo.setPlaylist({
					credits: this.songAttribution,
					author: author,
					playlist: this.playlist
				}, callback);
				
				this.isDirty = false;
			}
			else {
				callback && callback('Nothing to save.', this._playlistRepo.playlistId);
			}
		},
	
		movePlayhead : function movePlayhead(time) {
			var left = (time / this.totalTime) * 100;
			
			$('#playhead').css('left', left + '%');
		},
						
		zoomOut : function zoomOut() {
			if (!(this.width > 300)) { // first time zooming
				this.ZOOM_MIN = this.width = $('#timeline').width() - 10;
			}
			
			$('#timelineHolder').css('width', Math.max(this.ZOOM_MIN, this.width - this.ZOOM_AMOUNT));
		
			this.redrawAll();
		},
		
		zoomIn : function zoomIn() {
			if (!(this.width > 300)) { // first time zooming
				this.ZOOM_MIN = this.width = $('#timeline').width() - 10;
			}
		
			$('#timelineHolder').css('width', Math.min(this.ZOOM_MAX, this.width + this.ZOOM_AMOUNT));
		
			this.redrawAll();
		}
	};




	//installs and runs the music player 
	//	audio		- the URL to the audio file
	//	lsd 		- LSD object	
	//  songAttribution - Attribution object of the song's info
	$.fn.musicPlayer = function (audioUrl, lsd, songAttribution) {
		$('body').append(MUSIC_CONTROLS + '<div id="musicHolder"><audio id="music" controls="controls"><source src="' + audioUrl + '" type="audio/mpeg" /></audio></div>' + MUSIC_CONTROLS_END);
		
		lsd.isPaused = true; // wait until they start the vid!
		
		// replace lsd logo with song title
		$('#backgroundCanvasControls > h1')
			.html(songAttribution.toString(true, false));
		
		var popcorn = Popcorn( "#music" ),
			timeline = new Timeline(lsd, popcorn.duration(), songAttribution);
			isRecording = false,
			
			//controls
			play = function() {
				if (popcorn.readyState() >= 4 /*HAVE_ENOUGH_DATA*/) {
					$('body').addClass('playerLoaded');
					
					popcorn.play();
				}
				else {
					setTimeout(play, 200);
				}
			},
			pause = function() {
				popcorn.pause();
			},
			toggleRecord = function () {//isRecordOn) {
				isRecording = !isRecording; //(isRecordOn !== false && isRecordOn === true) || !isRecording;
				if (isRecording) {
					$('#musicControls').addClass('recording');
					
					lsd.showControls();
				}
				else {
					$('#musicControls').removeClass('recording');
					
					lsd.hideControls();
					
					// delete the previous recording, if it's the original from the page?
					/*
					if (!timeline.isDirty) {
						timeline.clearPlaylist();
						
						if (popcorn.paused() ) {
							console.log("#TODO: rewind to begining?"); 
							popcorn.currentTime(0);
						}
					}
					*/	
				}
			},
			saveRecording = function () {
				timeline.save();
			},
			
			onPlay = function () {
				$('#musicControls').removeClass('paused').addClass('playing');
				lsd.isPaused = false;
			},
			
			onPause = function () {
				$('#musicControls').removeClass('playing').addClass('paused');
				
				// pausing doesn't render opacity changes! TODO
				//lsd.isPaused = true;
			},
			
			showShareScreen = function showShareScreen(playlistId) {
				playlistId = playlistId || timeline._playlistRepo.playlistId;
				
				var shareUrl = 'http://lsd.odbol.com/battlehooch/joke/' + playlistId; //joke.php?playlist=' + playlistId;
				
				$('<div id="shareTrackScreen" class="dialogControls permanent" style="display:none"><h2>Share this video</h2>' +
					 "<div class='shareButtons'>" +
					 	'<div class="shareButton tweet"><iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?url=' + encodeURIComponent(shareUrl) + '&amp;via=ODDDevice&amp;count=none&amp;text=' + encodeURIComponent(songAttribution.toString()) + '" style="width:130px; height:21px;"></iframe></div>' +
						'<div class="shareButton facebook"><iframe src="http://www.facebook.com/plugins/like.php?href=' + encodeURIComponent(shareUrl) + '&amp;layout=button_count&amp;show_faces=false&amp;width=220&amp;action=like&amp;colorscheme=light&amp;height=21" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:50px; height:21px;" allowTransparency="true"></iframe></div>' +
					"</div><br class='clear' />" +
					'<label for="shareTrackUrl">Link: </label><input id="shareTrackUrl" type="text" value="' +
					 shareUrl + '" />' +
					 "<div class='dialogButton record button'>Remix your own video</div><div class='dialogButton button close'>Close</div></div>")
					
					.appendTo('body')
					.fadeIn('slow')
					.find('.button')
						.click(function () {
							$('#shareTrackScreen').remove();
						});
			},
			
			//for recording LSD events:
			lastEventItem = null,
			addPlaylistEvent = function(event) {
				if (isRecording) {
					var item = {
						time: popcorn.currentTime(),
						event: event
					};
					
					timeline.add(item);
					
					return item;
				}
				
				return null;
			},
			onChangeClip = function (event, layerId, val) {
				addPlaylistEvent({
					type: 'clip',
					layerId: layerId,
					clipId: val
				});
			},
			curLayerChanges = {},
			onChangeLayer = function (event, layerId, val) {
				// try to track when they started and ended the event so we can figure out a tween duration. 
				if (curLayerChanges[layerId]) {
					curLayerChanges[layerId].event.duration = popcorn.currentTime() - curLayerChanges[layerId].time;
					curLayerChanges[layerId].event.startOpacity = curLayerChanges[layerId].event.opacity;
					curLayerChanges[layerId].event.opacity = val;
					
					timeline.redraw(curLayerChanges[layerId]);
					
					// delete from cue but not from the playlist (since it's already added.)
					delete curLayerChanges[layerId];
				}
				else {
					curLayerChanges[layerId] = addPlaylistEvent({
						type: 'layer',
						layerId: layerId,
						opacity: val
					});
				}
			},
			onChangeComposition = function (event, val) {
				addPlaylistEvent({
					type: 'composition',
					composition: val,
					layerId: 0 //just show on top layer - these are global, not layer specific at the moment.
				});		
			},
			
			//cue timeline events
			cueEvent = function cueEvent(event) {		
				switch (event.type) {
					case 'clip':	
						$(timeline).trigger('changeClip.lsd', [event.layerId, event.clipId]);
					break;
					case 'layer':						
						$(timeline).trigger('opacityEnd.lsd', [event.layerId, event.opacity, event.duration * 1000.0]);
					break;
					case 'composition':	
						$(timeline).trigger('changeComposition.lsd', [event.composition]);
					break;
				}
			},
			//cue timeline events
			cuePreloadEvent = function cuePreloadEvent(event) {		
				$(lsd).trigger('preloadClip.lsd', [event.clipId]);
			},
			
			onPreloadClipFinished = function onPreloadClipFinished(event, clipId, numClipsStillLoading) {
				if (numClipsStillLoading <= 0) {
					$(lsd).unbind('numClipsStillLoading.lsd', onPreloadClipFinished); //only do for initial load
					
					// autoplay!
					play();
				}
			},
			
			//catch timeline events
			
			//this works for both adding and updating, since popcorn handles the updating of the same id.
			onEventAdded = function (ev, item) {
				//if (lastEventItem != item) { //protect against infinite loop event triggering. TODO: how to fix this???
					//wait a little bit in case you cue the event and popcorn triggers 
					setTimeout(function () {
						var id = "timelineItem_" + item.idx;
							
						popcorn.cue(item.time, function() {
console.log('cueEvent: ', item.idx, item.time, item.event.layerId);							
							cueEvent(item.event);
						});
						
						// also cue a preload event
						if (item.event.type == 'clip') {
							var preloadTime = Math.max(0, item.time - PRELOAD_DELAY);
							
							popcorn.cue(preloadTime, function() {
console.log('cueEvent preload: ', item.idx, item.time, item.event.clipId);							
								cuePreloadEvent(item.event);
							});
						}						
						
					}, 1000);
					lastEventItem = item;
				//}
			}
			/*,onEventRemoved = function (ev, item) {
				//if (lastEventItem != item) { //protect against infinite loop event triggering. TODO: how to fix this???
					//wait a little bit in case you cue the event and popcorn triggers 
					setTimeout(function () {
						var id = "timelineItem_" + item.idx;
						popcorn.removeTrackEvent(id, function() {
							cueEvent(item.event);
						});
					}, 1000);
					lastEventItem = item;
				//}
			}*/;

		//bind to lsd's event changes, and it to ours
		lsd.subscribeTo(timeline);

		//hide lsd until they start recording
		lsd.hideControls();

		//******UI*******

		//bind to player events to keep track
		popcorn
			.on('durationchange', function () {
				timeline.setTotalTime(popcorn.duration());
				
				timeline.load();
			})		
			.on('timeupdate', function () {
				timeline.movePlayhead(popcorn.currentTime());
			})						
			.on('play', onPlay)
			.on('pause', onPause)
			.on('ended', function () {
				showShareScreen();
			});

		$('#playButton').click(function () {
			if (popcorn.paused() ) {
				play()
			}
			else {
				pause();
			}
		});
		
		$('body').delegate('.record', 'click', function () {
			if (!isRecording) {
				if (popcorn.paused() ) {
					play();
				}
			}
			
			toggleRecord();
		});
		
		$('#saveButton').click(function () {
			var saveAs = false;//prompt("Enter a name to save as: ", 'Random ' + Math.round(Math.random() * 50000));
			
			timeline.save(saveAs);
		});
		
		$('#shareRButton').click(function () {
			var saveAs = false;//prompt("Enter a name to save as: ", 'Random ' + Math.round(Math.random() * 50000));
			
			timeline.save(saveAs, function (error, playlistId) {
				/*if (error) {
					alert('Your recording could not be saved: ' + error);
				}*/
				
				showShareScreen(playlistId);
			});
		});
		
		$('#deleteButton').click(function () {
			if (confirm("Delete all recorded tracks? (this cannot be undone)")) {
				timeline.clearPlaylist();
			}
		});
		
		/*
		var isHovering = false;
		$('#musicControls').hover(function() {
				isHovering = true;
				setTimeout(function () { if (isHovering) $('#music').show() }, 300);
			},
			function() {
				isHovering = false;
				setTimeout(function () { if (!isHovering) $('#music').hide() }, 300);
			});	
			*/
		var isHovering = false,
			musicControlsWidth = $('#musicControls').width(),
			playerWidth = $('#musicHolder').outerWidth();
		$('#musicControls').hover(function() {
				isHovering = true;
				setTimeout(function () { 
						//arg .hide() on the music player doesnt work in chrome
						if (isHovering && !isRecording) 
							$('#musicControls').animate({ width: musicControlsWidth + playerWidth + 'px' }, 300) 
					}, 100);
			},
			function() {
				isHovering = false;
				setTimeout(function () { 
						//arg .hide() on the music player doesnt work in chrome
						if (!isHovering && !isRecording) 
							$('#musicControls').animate({ width: musicControlsWidth + 'px' }, 300) 
					}, 100);
			});	
		
		
		//bind to LSD events and record them
		$(lsd)
			.bind('changeClip.lsd', onChangeClip)
			.bind('opacityEnd.lsd', onChangeLayer)
			.bind('opacityStart.lsd', onChangeLayer)
			.bind('changeComposition.lsd', onChangeComposition)
			.bind('preloadClipFinished.lsd', onPreloadClipFinished);
			
		//bind to timline events
		$(timeline)
			.bind('added.timeline', onEventAdded)
			.bind('updated.timeline', onEventAdded) //adding/updating doesn't matter!
			.bind('cleared.timeline', function () {
				//remove all popcorn events as well.
				var evs = popcorn.getTrackEvents();
				for (var i = 0; i < evs.length; i++) {
					popcorn.removeTrackEvent(evs[i].id);
				}
											
				// add documentation triggers
				popcorn.cue(10, function () {
					$().documentate().show('teaser');
				});
			}); 
			
		popcorn.preload('auto');
	};
   

})( jQuery );