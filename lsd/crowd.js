//enum for queue
var QUEUE_STATUS = {
	'OFFLINE': 	0,
	'WAITING': 	1,
	'PLAYING': 	2,
	'MASTER':	3
};

// set FIREBASE_URL before you call any scripts
var FIREBASE_ROOT_BASE = FIREBASE_URL;

//sanitizes any text for insertion as HTML
function htmlEncode(value){
  return $('<div/>').text(value).html();
}

/**
*	Gives access to Firebase for real-time interaction.
*
**/
var CrowdControl = function () {

};

CrowdControl.isUserOnline = function(user) {
	return !(user.online == QUEUE_STATUS.OFFLINE || parseInt(user.online) == QUEUE_STATUS.OFFLINE);
};
	
CrowdControl.prototype = {
	screenId : null,
	fireBaseRoot : FIREBASE_ROOT_BASE,
	
	userStatus : QUEUE_STATUS.OFFLINE,
	
	init : function (lsd, minRating) {
		var crowd = this;
		
			//get user id
			var lsdUserId = window.localStorage.getItem("lsdUserId");
			if ( !lsdUserId )
				lsdUserId = prompt("Please enter your VJ name:", userId);
	
			if ( lsdUserId ) {
				userId = lsdUserId;
				window.localStorage.setItem("lsdUserId", userId);
			}
			
			
			
		//INITIATE CROWD CONTROL
		
		var screenIdMatch = (/screen=([^&#]+)/).exec(window.location.href);
		if (screenIdMatch && screenIdMatch.length > 1)
			this.screenId = screenIdMatch[1];
		if (this.screenId)
			this.screenId = this.screenId.replace(/[^\w\d]/g, ''); //don't allow special characters
		else
			this.screenId = 'lounge';
		this.fireBaseRoot += '/' + this.screenId;
	
		var presenceRef = new Firebase(this.fireBaseRoot + '/queue/' + userId + '/online');
		
		//Make sure if I lose my connection I am marked as offline.
		presenceRef.setOnDisconnect(QUEUE_STATUS.OFFLINE);
		//Now, mark myself as online.
		presenceRef.setWithPriority(QUEUE_STATUS.WAITING, QUEUE_STATUS.WAITING);
	
		//keep track of status in queue
		presenceRef.on('value', function(snapshot) {
		  if(snapshot.val() === null) {
			console.log('User does not exist.');
			crowd.userStatus = QUEUE_STATUS.OFFLINE;
		  } else {
			crowd.userStatus = snapshot.val();
		  }
		});
	
		//immediately start
		if ((/master=true/).test(window.location.href)) { //TODO: check other users in queue if you're first
			presenceRef.setWithPriority(QUEUE_STATUS.MASTER, QUEUE_STATUS.MASTER);
						
			//CROWD
			//alert firebase that this screen is still active
			var activeRef = new Firebase(this.fireBaseRoot + '/activeSince');
			//Make sure if master loses connection the screen is marked as offline.
			activeRef.setOnDisconnect(0); //priority is automatically set to null on disconnect
			
			var ratingRef = new Firebase(this.fireBaseRoot + '/minRating');
			ratingRef.set(minRating);
			
			setInterval(function () {
				var activeRef = new Firebase(this.fireBaseRoot);
				var timestamp = Math.round((new Date()).getTime() / 1000);
				activeRef.setPriority(timestamp);
				activeRef.child('activeSince').set(timestamp);
			}, 30000);
		}
		else {
			presenceRef.setWithPriority(QUEUE_STATUS.PLAYING, QUEUE_STATUS.PLAYING);
		}
			
			
			
		//make users list
		$("body").append("<div id='userList' class='dialogControls'><h1>VJs Online</h1><br class='clear' /><ul></ul></div>");

		var usersRef = new Firebase(this.fireBaseRoot + '/queue/');
		usersRef.on('value', function(snapshot) {
		  var users = snapshot.val();
		  var userHTML = "";
		  var offlineUserHTML = "";
		  
		  if(users) {
			snapshot.forEach(function (userSnap) {
				var u = userSnap.val();
				var i = userSnap.name();
				
				var liHTML = "<li class='status_" + escape(u.online);
				if (i == userId)
					liHTML += " self"; 
				liHTML += "'>" + htmlEncode(i) + "</li>";
				
				//build list in reverse
				if (CrowdControl.isUserOnline(u))
					userHTML = liHTML + userHTML;
				else
					offlineUserHTML = liHTML + offlineUserHTML;
			});
		  }
		  
		  //keep offline users last (since priorty sort doesn't really work that well)
		  $("#userList ul").eq(0).html(userHTML + offlineUserHTML);
		});






			//CROWD: receive layer change events
			var compRef = new Firebase(this.fireBaseRoot + '/composition');	
			compRef.on('value', function(snapshot) {
					var val = snapshot.val();
					if (val >= 0) {
						$(crowd).trigger('changeComposition.lsd', [val]);
					}
			});


			
			$(lsd)
				.bind('changeClip.lsd', function () {
					crowd.setClip.apply(crowd, arguments);
				})
				.bind('opacityEnd.lsd', function () {
					crowd.setOpacity.apply(crowd, arguments);
				})
				.bind('changeComposition.lsd', function () {
					crowd.setComposition.apply(crowd, arguments);
				});


		return this;
	},



	//creates event triggers to handle when clip is changed remotely	
	makeOnClipChange : function (layerId) {
				var crowd = this;
			
				//CROWD: receive layer change events
				var clipRef = new Firebase(this.fireBaseRoot + '/layers/' + layerId + '/clip');
				clipRef.on('value', function(snapshot) {
					//var layerId = parseInt(clipRef.parent().name());
					var clipId = snapshot.val();
					
					//find clip and see if it's changed
					if (clipId) {
						//changeClipById(layerId, clipId);
						$(crowd).trigger('changeClip.lsd', [layerId, clipId]);
					}
				});
			},
			
	makeOnLayerChange : function (layerId) {
				var crowd = this;
				//CROWD: receive layer opacity change events
				var clipRef = new Firebase(this.fireBaseRoot + '/layers/' + layerId + '/opacity');
				clipRef.on('value', function(snapshot) {
					var val = snapshot.val();
					if (val >= 0) {
						//changeLayerOpacity(layerId, val);
						$(crowd).trigger('opacityEnd.lsd', [layerId, val]);
					}
				});
			},
			
			
	setComposition : function(event, value) {
		//CROWD: receive layer change events
		var clipRef = new Firebase(this.fireBaseRoot + '/composition');
		clipRef.set( value );
	},
	
	setClip : function(event, layerId, clipId) {
		//console.log('changing clip on layer ' + fireBaseRoot + '/layers/' + currentLayer.id + '/clip' + " to " + $this.data("vidClip").id );
		var clipRef = new Firebase(this.fireBaseRoot + '/layers/' + layerId + '/clip');
		clipRef.set( clipId );
	},
	
	//CROWD: receive layer change events
	setOpacity : function(event, layerId, opacity) {
		var clipRef = new Firebase(this.fireBaseRoot + '/layers/' + layerId + '/opacity');
		clipRef.set( opacity );
	},
	
	getScreens : function (limit, startAt, callback) {
		var screensRef = new Firebase(FIREBASE_ROOT_BASE);
		screensRef.startAt(startAt).limit(limit); //only get active screens (non-active are null/0)
		screensRef.once('value', callback);
	},

};