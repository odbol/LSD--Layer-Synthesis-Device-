// Replace with your own API key and session ID. See https://dashboard.tokbox.com/projects
var TOKBOX_API_KEY = 22961042,
	TOKBOX_SESSION_ID = '2_MX4yMjk2MTA0Mn4xMjcuMC4wLjF-TW9uIEFwciAyMiAxNDoyNDozMiBQRFQgMjAxM34wLjE0MjQwNTQ1fg',
	TOKBOX_TOKEN = 'T1==cGFydG5lcl9pZD0yMjk2MTA0MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mNTk0NDZiMTQ0ZDQzNzhjZjM5Y2JjMGNkYjcxOTk1YTc5NjhlZjY0OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9Ml9NWDR5TWprMk1UQTBNbjR4TWpjdU1DNHdMakYtVFc5dUlFRndjaUF5TWlBeE5Eb3lORG96TWlCUVJGUWdNakF4TTM0d0xqRTBNalF3TlRRMWZnJmNyZWF0ZV90aW1lPTEzNjY2NjU4OTEmbm9uY2U9MC4wMTk5NjI1ODM5MDQ5MzQ2NiZleHBpcmVfdGltZT0xMzY5MjU3ODkwJmNvbm5lY3Rpb25fZGF0YT0=';

	
/***

	Initializes a TokBox remote webcam connection via WebRTC.

	@param Function onSubscribeCallback(videoElementHolderId) Called when a new video stream is available.

***/
var RemoteCam = function RemoteCam(onSubscribeCallback) {
	TB.addEventListener("exception", exceptionHandler);
		
		var $remotecams = $('<div id="remotecams" style="position:absolute;z-index:-1;width:410px;height:410px;"></div>')
				.appendTo('body'),


			/*** 

				creates a clip holder and adds the clip to LSD. 

				@returns the ID of the element to be replaced by the <video> object from session.subscribe().
			***/
			createClipHolder = function (feedId) {
				$remotecams.append('<div id="' + feedId + '"><div id="' + feedId + '_el"></div></div>');

				onSubscribeCallback && onSubscribeCallback(feedId);

				return feedId + '_el';
			},

			sessionConnectedHandler = function sessionConnectedHandler(event) {
				subscribeToStreams(event.streams);

				var feedId = createClipHolder('camSource_publisher');
				
				var publisher = TB.initPublisher(TOKBOX_API_KEY, feedId, {name: 'self', publishAudio: false});
				session.publish(publisher);
			},
			
			streamCreatedHandler = function streamCreatedHandler(event) {
				subscribeToStreams(event.streams);
			},
			
			subscribeToStreams = function subscribeToStreams(streams) {
				for (i = 0; i < streams.length; i++) {
					var stream = streams[i];
					if (stream.connection.connectionId != session.connection.connectionId) {
						var feedId = createClipHolder('camSource_' + stream.connection.connectionId);

						session.subscribe(stream, feedId);
					}
				}
			},
			
			exceptionHandler = function exceptionHandler(event) {
				console && console.log("RemoteCam Error: " + event.message);
			},

		session = TB.initSession(TOKBOX_SESSION_ID); 



		session.addEventListener("sessionConnected", sessionConnectedHandler);
		session.addEventListener("streamCreated", streamCreatedHandler);
		session.connect(TOKBOX_API_KEY, TOKBOX_TOKEN);
};
