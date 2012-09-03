/***
	Music Video Player
	
	Creates an audio track and triggers LSD events during parts of the audio.
	
	Requirements: popcorn.js
	
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

(function( $ ){

	var MUSIC_CONTROLS = "<div id='musicControls' class='dialogControls'><ul class='icons buttons ui-widget ui-helper-clearfix'><li id='playButton' class='play button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-play'>Play</span></li><li id='recordButton' class='record button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-bullet'>Record</span></li><li id='saveButton' class='save button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-disk'>Save</span></li></ul>",
		MUSIC_CONTROLS_END = '</div>';

	var FIREBASE_ROOT_BASE = 'http://gamma.firebase.com/gif_jockey/_playlists';


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
			if (!this.playlistId)
				this.playlistId = 'default';
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
		
		setPlaylist : function (playlistId, playlist) {
			playlistId = playlistId || this.playlistId;
			
			var clipRef = new Firebase(FIREBASE_ROOT_BASE + '/' + playlistId);
			clipRef.set( playlist );
		}
	};

	/**
		the timeline gui
	**/
	var Timeline = function(lsd, totalTime) {
		var layersHTML = '';
		for (var i = 0; i < 3; i++) {
			layersHTML += '<div id="timelineLayer_' + i + '" class="timelineLayer"></div>';
		}
	
		$('#musicControls').append('<div id="timeline"><div id="playhead"></div>' + layersHTML + '</div>');
		
		this.lsd = lsd;
		this.totalTime = totalTime;
		
		this._playlistRepo = new PlaylistRepo().init();
	};
	
	Timeline.prototype = {
		totalTime : 0,
		width : 0,
		
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
			$('#timeline timelineLayer').each(function () {
				$(this).empty();
			});
		}, 
		
		load : function load() {
			var that = this;
			
			this._playlistRepo.getPlaylist(function (song) {
				var playlist = song.playlist;
				
				that.clearPlaylist();
				for (var i = 0; i < playlist.length; i++) {
					that.add(playlist[i]);
				}
				
				$(document).trigger('playlistLoaded.timeline', [this.playlist]);
			});
		},
		
		render : function render(item) {
			var event = item.event,
				left = (item.time / this.totalTime) * 100;//* this.width;// percents don't work well in chrome
		
			this.width = $('#timeline').width();
		
			switch (event.type) {
				case 'clip':	
					var clip = this.lsd.getVidClipById(event.clipId);
						
					item$el = $('<div class="clipThumb"><img src="' + clip.thumbnail + '" /></div>');
				break;
				case 'layer':	
					var height = event.opacity * 100; 
					
					item$el = $('<div class="layerOpacity"></div>')
						.css('height', Math.round(height) + '%');
				break;
				case 'composition':	
					item$el = $('<div class="composition"><span>' + event.composition + '</span></div>');
				break;
			}
			
			if (item$el) {
				item$el
						.appendTo('#timelineLayer_' + event.layerId)
						.css('left', Math.round(left) + '%');
			}
		},
		
		add : function add(item) {
			this.render(item);			
			this.playlist.push(item);
			
			$(this).trigger('added.timeline', [item]);
		},
		
		save : function save(saveAs) {			
			this._playlistRepo.setPlaylist(saveAs, {
				title: "Joke",
				playlist: this.playlist
			});
		},
	
		movePlayhead : function movePlayhead(time) {
			var left = (time / this.totalTime) * 100;
			
			$('#playhead').css('left', left + '%');
		}
	};




	//installs and runs the music player 
	//	audio		- the URL to the audio file
	//	lsd 		- LSD object	
	$.fn.musicPlayer = function (audioUrl, lsd) {
		$('body').append(MUSIC_CONTROLS + '<div id="musicHolder"><audio id="music" controls="controls"><source src="' + audioUrl + '" type="audio/mpeg" /></audio></div>' + MUSIC_CONTROLS_END);
		
		var popcorn = Popcorn( "#music" ),
			timeline = new Timeline(lsd, popcorn.duration());
			isRecording = false,
			
			//controls
			play = function() {
				popcorn.play();
			},
			pause = function() {
				popcorn.pause();
			},
			toggleRecord = function () {//isRecordOn) {
				isRecording = !isRecording; //(isRecordOn !== false && isRecordOn === true) || !isRecording;
				if (isRecording) {
					$('#musicControls').addClass('recording');
				}
				else {
					$('#musicControls').removeClass('recording');
				}
			},
			saveRecording = function () {
				timeline.save();
			},
			
			onPause = function () {
				$('#musicControls').removeClass('playing').addClass('paused');
			}
			
			//for recording LSD events:
			lastEventItem = null,
			addPlaylistEvent = function(event) {
				if (isRecording) {
					var item = {
						time: popcorn.currentTime(),
						event: event
					};
					
					timeline.add(item);
				}
			},
			onChangeClip = function (event, layerId, val) {
				addPlaylistEvent({
					type: 'clip',
					layerId: layerId,
					clipId: val
				});
			},
			onChangeLayer = function (event, layerId, val) {
				addPlaylistEvent({
					type: 'layer',
					layerId: layerId,
					opacity: val
				});			
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
						$(timeline).trigger('opacityEnd..lsd', [event.layerId, event.opacity]);
					break;
					case 'composition':	
						$(timeline).trigger('changeComposition.lsd', [event.composition]);
					break;
				}
			},
			
			//catch timeline events
			onEventAdded = function (ev, item) {
				//if (lastEventItem != item) { //protect against infinite loop event triggering. TODO: how to fix this???
					//wait a little bit in case you cue the event and popcorn triggers 
					setTimeout(function () {
						popcorn.cue(item.time, function() {
							cueEvent(item.event);
						});
					}, 1000);
					lastEventItem = item;
				//}
			};

		//bind to lsd's event changes, and it to ours
		lsd.subscribeTo(timeline);


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
			.on('play', function () {
				$('#musicControls').removeClass('paused').addClass('playing');
			})
			.on('pause', onPause);
			/*.on('ended', function () {
				if (isRecording) {
					toggleRecord();
				}
			});*/

		$('#playButton').click(function () {
			if (popcorn.paused() ) {
				play()
			}
			else {
				pause();
			}
		});
		
		$('#recordButton').click(function () {
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
			.bind('changeComposition.lsd', onChangeComposition)
			
		//bind to timline events
		$(timeline)
			.bind('added.timeline', onEventAdded);
			
	};
   

})( jQuery );