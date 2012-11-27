var BaseRenderer = function () {
	BaseRenderer.init.apply(this, arguments);
};

BaseRenderer.init = function (lsd, layers, canvasId, compositeTypes) {
	this.layers = layers || [];
	this.lsd = lsd;

	canvasId = canvasId || 'backgroundCanvas';
	this.canvas = document.getElementById(canvasId);

	this.compositeTypes = compositeTypes || 
		['lighter','darker','copy','xor',
		  'source-over','source-in','source-out','source-atop',
		  'destination-over','destination-in','destination-out','destination-atop'
		];
};

BaseRenderer.prototype = {
	lsd: null, 

	// array of VidLayer objects
	layers: null,

	// the canvas DOM object
	canvas: null,

	addLayer : function addLayer(layer) {
		this.layers.push(layer);
	},

	addLayers : function addLayers(layers) {
		this.layers = this.layers.concat(layers);
	},

	getLayer : function getLayer(layerIdx) {
		return this.layers[layerIdx];
	},

	getContext : function getContext() {
		return null;
	},

	isSupported : function isSupported() {
		return !!this.getContext();
	},

	/*** 
		OVERRIDE THIS METHOD.

		Starts the animation rendering.

		Returns true if successful, false if not supported.
	***/
	start : function start() {
		return false;
	},


	// EFFECTS

	getBlendModes : function getBlendModes() {
		return this.compositeTypes;
	},

	getBlendMode : function getBlendMode() {
		return this._curBlendMode;
	},

	setBlendMode : function setBlendMode(mode) {
		this._curBlendMode = mode;
	},

	getCanvas : function getCanvas() {
		return this.canvas;
	}

};