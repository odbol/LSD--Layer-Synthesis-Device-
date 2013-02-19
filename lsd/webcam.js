	
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
				
				var publisher = TB.initPublisher(22961042, feedId, {name: 'self', publishAudio: false});
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

		session = TB.initSession("2_MX4yMjk2MTA0Mn4xMjcuMC4wLjF-VHVlIEZlYiAxOSAwMTowMToxMyBQU1QgMjAxM34wLjI3MDA0NDc0fg"); 



// Replace with your own session ID. See https://dashboard.tokbox.com/projects
		session.addEventListener("sessionConnected", sessionConnectedHandler);
		session.addEventListener("streamCreated", streamCreatedHandler);
		session.connect(22961042, "T1==cGFydG5lcl9pZD0yMjk2MTA0MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz02YmJkYWQyMDIyYThiZDZjN2Q4ZmY3MGQ3NmM1YmYwOWQ5N2IwMmIxOnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9Ml9NWDR5TWprMk1UQTBNbjR4TWpjdU1DNHdMakYtVkhWbElFWmxZaUF4T1NBd01Ub3dNVG94TXlCUVUxUWdNakF4TTM0d0xqSTNNREEwTkRjMGZnJmNyZWF0ZV90aW1lPTEzNjEyNjQ1MTEmbm9uY2U9MC45NzUxODU1MzA2OTA0NjM4JmV4cGlyZV90aW1lPTEzNjM4NTY1MTAmY29ubmVjdGlvbl9kYXRhPQ=="); // Replace with your API key and token. See https://dashboard.tokbox.com/projects
};
