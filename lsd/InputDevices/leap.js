/***

	LeapMotion input device. Sends OSC-like message events to whatever wants them. 

***/ 

(function (InputDevices) {
	var
		// consts for leapmotion coordinate bounds. 
		LEAP_X_MAX = 150, // x and z are assumed symetrical around 0-axis.
		LEAP_Y_MAX = 400, // y is not symetrical. from 0 - 400


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

		changeInputVal = function (buttonIdx, x, y, z) {
			var arrayIdx = buttonIdx * 2;

			if (arrayIdx < 0) return;

//console.log('changeInputVal: ' + buttonIdx, arrayIdx, x, y);	
			inputValues[arrayIdx + 0] = (x + LEAP_X_MAX) / (LEAP_X_MAX * 2);
			inputValues[arrayIdx + 1] = y / LEAP_Y_MAX;

			if (x !== false && y !== false) {
				onChange(buttonIdx, arrayIdx);
			}
		},

		onLoop = function onLoop(frame) {
			var i = 0;
			for (; i < frame.pointables.length; i++) {
				var pointable = frame.pointables[i],
					pos = pointable.tipPosition;


				changeInputVal(i, pos[0], pos[1], pos[2]);
			}

			// erase whatever's leftover
			for (i = i * 2; i < inputValues.length; i++) {
				inputValues[i] = false;
			}

		},

		isStarted = false,
		start = function start() {

			// touch events take precedence. note this can be true even if browser is not a touch device.
			if (Leap && !isStarted) {
				// Setup Leap loop with frame callback function
				var controllerOptions = {enableGestures: false};

				Leap.loop(controllerOptions, onLoop);

				isStarted = true;
			}

			return this;
		},

		bind = function bind(eventName, func) {
			$(InputDevices).bind(eventName + '.mouse', func);
		};

	InputDevices.registerDevice('mouse', 
		{
			attachToInput: attachToInput,
			getNumInputs : function () {
				return inputValues.length;
			},
			start : start,
			bind : bind
		});
	//};
})(window.InputDevices);