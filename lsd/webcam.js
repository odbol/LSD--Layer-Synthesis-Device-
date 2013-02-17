	

var RemoteCam = function RemoteCam() {
	TB.addEventListener("exception", exceptionHandler);
			
// Replace with your own session ID. See https://dashboard.tokbox.com/projects
		var $remotecams = $('<div id="remotecams" style="position:absolute;z-index:-1;width:410px;height:410px;"></div>')
				.appendTo('body'),

			sessionConnectedHandler = function sessionConnectedHandler(event) {
				 subscribeToStreams(event.streams);

				var feedId = 'camSource_publisher';
				$remotecams.append('<div id="' + feedId + '"><div id="' + feedId + '_el"></div></div>');

				 var publisher = TB.initPublisher(22961042, feedId + '_el', {name: 'self', publishAudio: false});
				 session.publish(publisher);
			},
			
			streamCreatedHandler = function streamCreatedHandler(event) {
				subscribeToStreams(event.streams);
			},
			
			subscribeToStreams = function subscribeToStreams(streams) {
				for (i = 0; i < streams.length; i++) {
					var stream = streams[i];
					if (stream.connection.connectionId != session.connection.connectionId) {
						var feedId = 'camSource_' + stream.connection.connectionId;

						$remotecams.append('<div id="' + feedId + '"><div id="' + feedId + '_el"></div></div>');

						session.subscribe(stream, feedId + '_el');
					}
				}
			},
			
			exceptionHandler = function exceptionHandler(event) {
				alert(event.message);
			},

			session = TB.initSession("2_MX4yMjk2MTA0Mn4xMjcuMC4wLjF-U3VuIEZlYiAxNyAxMDo0MjozNSBQU1QgMjAxM34wLjUyMjE2ODN-"); 


		session.addEventListener("sessionConnected", sessionConnectedHandler);
		session.addEventListener("streamCreated", streamCreatedHandler);
		session.connect(22961042, "T1==cGFydG5lcl9pZD0yMjk2MTA0MiZzZGtfdmVyc2lvbj10YnJ1YnktdGJyYi12MC45MS4yMDExLTAyLTE3JnNpZz1mZjA3MjlhMjA4ZWM4NTJmYjIyYmQ1MzcwMmIzMWNhODAyMDhiNjc2OnJvbGU9cHVibGlzaGVyJnNlc3Npb25faWQ9Ml9NWDR5TWprMk1UQTBNbjR4TWpjdU1DNHdMakYtVTNWdUlFWmxZaUF4TnlBeE1EbzBNam96TlNCUVUxUWdNakF4TTM0d0xqVXlNakUyT0ROLSZjcmVhdGVfdGltZT0xMzYxMTI2NjEyJm5vbmNlPTAuNjk3NTM0Nzk3MzcwNTYzNyZleHBpcmVfdGltZT0xMzYxMjEzMDEyJmNvbm5lY3Rpb25fZGF0YT0="); // Replace with your API key and token. See https://dashboard.tokbox.com/projects


			
};
