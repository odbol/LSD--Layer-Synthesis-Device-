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

	var MUSIC_CONTROLS = "<div id='musicControls' class='dialogControls'><ul class='icons buttons ui-widget ui-helper-clearfix'><li id='playButton' class='play button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-play'>Play</span></li><li id='recordButton' class='record button ui-state-default ui-corner-all'><span class='ui-icon ui-icon-bullet'>Record</span></li></ul>";



	//installs and runs the music player 
	//	audio		- the URL to the audio file	
	$.fn.musicPlayer = function (audioUrl) {
		$('body').append(MUSIC_CONTROLS + '<div id="musicHolder"><audio id="music" controls="controls"><source src="' + audioUrl + '" type="audio/mpeg" /></audio></div></div>')
		var popcorn = Popcorn( "#music" ),
			isRecording = false,
			//keeps track of all events from LSD during recording for later playback.
			playlist = [],
			
			//controls
			play = function() {
				popcorn.play();
			},
			pause = function() {
				popcorn.pause();
			},
			toggleRecord = function () {
				isRecording = !isRecording;
				if (isRecording) {
					$('#musicControls').addClass('recording');
				}
				else {
					$('#musicControls').removeClass('recording');
				}
			},
			onPause = function () {
				$('#musicControls').removeClass('playing').addClass('paused');
			}
			
			//for recording LSD events:
			addPlaylistEvent = function(event) {
				if (isRecording) {
					playlist.push({
						time: popcorn.currentTime(),
						event: event
					});
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
					composition: val
				});		
			};

		//bind to player events to keep track
		popcorn
			.on('play', function () {
				$('#musicControls').removeClass('paused').addClass('playing');
			})
			.on('pause', onPause);
			//.on('ended', onPause);

		$('#playButton').click(function () {
			if (popcorn.paused() ) {
				play()
			}
			else {
				pause();
			}
		});
		
		$('#recordButton').click(function () {
			if (isRecording) {
				pause();
			}
			else {
				if (popcorn.paused() ) {
					play();
				}
				toggleRecord();
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
						if (isHovering) 
							$('#musicControls').animate({ width: musicControlsWidth + playerWidth + 'px' }, 300) 
					}, 100);
			},
			function() {
				isHovering = false;
				setTimeout(function () { 
						//arg .hide() on the music player doesnt work in chrome
						if (!isHovering) 
							$('#musicControls').animate({ width: musicControlsWidth + 'px' }, 300) 
					}, 100);
			});	
		
		
		//bind to LSD events and record them
		$(document)
			.bind('changeClip.lsd', onChangeClip)
			.bind('changeLayer.lsd', onChangeLayer)
			.bind('changeComposition.lsd', onChangeComposition);	
	};
   

})( jQuery );