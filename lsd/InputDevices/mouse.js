/***

	Mouse input device. Sends OSC-like message events to whatever wants them. 
	Uses touch events if available.

***/ 
if (!window.InputDevices) {

	/****
		An OSC-like message.

		@param path {Object|String} The path. e.g.: "/mouse/button1/x" == ["mouse", "button1", "x"]
		@param value {Anything} The value. Usually a primitive, but can be an array as well.
	***/
	var OSCMessage = function (path, value) {
		this.path = path;
		this.value = value;
	};
	OSCMessage.prototype = {
		path: '',
		value: null,

		_pathObj : false,
		getPathObj : function getPathObj() {
			if (this._pathObj === false) {
				if (typeof this.path == 'string') {
					this._pathObj = this.path.split('/');
				}
				else {
					this._pathObj = this.path;
				}
			}	

			return this._pathObj;
		}
	};

	window.InputDevices = {
		OSCMessage: OSCMessage
	};
}

(function (InputDevices) {
	var 
		// false denotes the input hasn't been changed.
		// TODO: or should it be that the draw func sets them to false to denote it's been used?
		inputValues = [ false, false, false, false, false, 
						false, false, false, false, false,
						false, false, false, false, false,
						false, false, false, false, false], // how many fingers could they possibly have?

		onChange = function onChange(buttonIdx, arrayIdx) {
			var path = ['mouse', buttonIdx, 'xy'],
				value = inputValues.slice(arrayIdx, arrayIdx + 2);

			$(InputDevices).trigger('change.mouse', [new InputDevices.OSCMessage(path, value)]);
		},

		mouseTracker,
		touchTracker,

		attachToInput = function attachToInput($el) {

		},

		changeInputVal = function (buttonIdx, x, y) {
			var arrayIdx = buttonIdx * 2;

			if (arrayIdx < 0) return;

//console.log('changeInputVal: ' + buttonIdx, arrayIdx, x, y);	
			inputValues[arrayIdx + 0] = x;
			inputValues[arrayIdx + 1] = y;

			if (x !== false && y !== false) {
				onChange(buttonIdx, arrayIdx);
			}
		},

		initMouseTracker = function () {
			var buttonIdx = 0,
				mouseTrackerOnStart = function (ev) {
						changeInputVal(ev.which - 1, ev.clientX, ev.clientY);

					},
				mouseTrackerOnDrag = function (ev) {
						//buttonIdx = (ev.which - 1) * 2;

						changeInputVal(ev.which - 1, ev.clientX, ev.clientY);

						//onChange(ev.which, buttonIdx);
					},		
				mouseTrackerOnEnd = function (ev) {
						//buttonIdx = (ev.which - 1) * 2;
						
						changeInputVal(ev.which - 1, false, false);
					};

			return $('#backgroundCanvas')
					.on('mousedown', mouseTrackerOnStart)
					.on('mousemove', mouseTrackerOnDrag)
					.on('mouseup', mouseTrackerOnEnd);
		},

		initTouchTracker = function () {
			var ongoingTouches = [],
				ongoingTouchIndexById = function ongoingTouchIndexById(idToFind) {
				  for (var i=0; i<ongoingTouches.length; i++) {
				    var id = ongoingTouches[i].identifier;
				     
				    if (id == idToFind) {
				      return i;
				    }
				  }
				  return -1;    // not found
				},

				// mozilla MDN helper functions follow:
				handleStart = function handleStart(evt) {
				  var touches = evt.changedTouches;

//console.log('handleStart: ' + touches, evt);	
				  if (!touches) return;

				  evt.preventDefault();

				  for (var i=0; i<touches.length; i++) {
				    ongoingTouches.push(touches[i]);

				    changeInputVal(i, touches[i].pageX, touches[i].pageY);
				  }
				},
				handleMove = function handleMove(evt) {
				  var touches = evt.changedTouches;

//console.log('handleMove: ' + touches, evt);	
				  if (!touches) return;

				  evt.preventDefault();				   				         
				  for (var i=0; i<touches.length; i++) {
				    var idx = ongoingTouchIndexById(touches[i].identifier);
				 				    
				    changeInputVal(i, touches[i].pageX, touches[i].pageY);

				    ongoingTouches.splice(idx, 1, touches[i]);  // swap in the new touch record
				  }
				},
				handleEnd = function handleEnd(evt) {
				  var touches = evt.changedTouches;

				  if (!touches) return;

				  evt.preventDefault();

//console.log('handleend: ' + touches, evt);					         
				  for (var i=0; i<touches.length; i++) {
				    var idx = ongoingTouchIndexById(touches[i].identifier);
				     
				    changeInputVal(i, false, false);

				    ongoingTouches.splice(i, 1);  // remove it; we're done
				  }
				},

				handleCancel = handleEnd;

			// FUCK JQUERY FUCKING UP MY EVENTS. do this straight up browser style.
			el = document.getElementById("backgroundCanvas");
    
			el.addEventListener("touchstart", handleStart, false);
			el.addEventListener("touchmove", handleMove, false);
			el.addEventListener("touchend", handleEnd, false);
			el.addEventListener("touchcancel", handleEnd, false);
			el.addEventListener("touchleave", handleEnd, false);

			return el;
		},

		start = function start() {

			// touch events take precedence. note this can be true even if browser is not a touch device.
			if (Modernizr.touch && !touchTracker) {
				touchTracker = initTouchTracker();
			}

			if (!mouseTracker) {
				mouseTracker = initMouseTracker();
			}

		};

	InputDevices.mouse = 
		{
			attachToInput: attachToInput,
			getNumInputs : function () {
				return inputValues.length;
			},
			start : start
		};
	//};
})(window.InputDevices);