/***

	Mouse input device. Sends OSC-like message events to whatever wants them.

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
		inputValues = [false, false, false, false],

		onChange = function onChange(buttonIdx) {
			var path = ['mouse', buttonIdx, 'xy'],
				value = inputValues.slice(buttonIdx, buttonIdx + 2);

			$(InputDevices).trigger('change.mouse', [new InputDevices.OSCMessage(path, value)]);
		},

		buttonIdx = 0,
		mouseTrackerOnStart = function (ev) {
				buttonIdx = (ev.which - 1) * 2;

				inputValues[0 + buttonIdx] = ev.clientX;
				inputValues[1 + buttonIdx] = ev.clientY;

				onChange(ev.which);
			},
		mouseTrackerOnDrag = function (ev) {
				inputValues[0 + buttonIdx] = ev.clientX;
				inputValues[1 + buttonIdx] = ev.clientY;

				onChange(ev.which);
			},		
		mouseTrackerOnEnd = function (ev) {
				inputValues[0 + buttonIdx] = false;
				inputValues[1 + buttonIdx] = false;
			},
		mouseTracker,

		attachToInput = function attachToInput($el) {

		},

		start = function start() {

 			if (!mouseTracker) {
 				mouseTracker = $('#backgroundCanvas')
					.on('mousedown', mouseTrackerOnStart)
					.on('mousemove', mouseTrackerOnDrag)
					.on('mouseup', mouseTrackerOnEnd);
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