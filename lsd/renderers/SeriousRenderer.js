/****
	3d WebGL renderer using Seriously.js

	@inherits BaseRenderer
***/
var SeriousRenderer = function SeriousRenderer(lsd, layers, canvasId, compositeTypes) {
		BaseRenderer.init.apply(this, arguments);
	},

	/*** 
		A wrapper for a VidLayer from LSD. Attaches various Seriously components to it.
	
	***/
	SeriousLayer = function SeriousLayer(seriously, vidLayer) {
		var self = this;

		this.seriously = seriously;
		this.layer = vidLayer;

		this.effects = [ this.seriously.effect('ripple') ];

		// EVENT LISTENERS
		/*vidLayer
			.bind('setOpacity.lsd', function () {
				self.onSetOpacity.apply(self, arguments);
			})	
			.bind('clipLoaded.lsd', function () {
				self.onClipLoaded.apply(self, arguments);
			});
*/ 
	}; 
  
SeriousLayer.prototype = {
	onSetOpacity : function onSetOpacity(ev, opacity) {
		this.source.amount = opacity;
	},

	onClipLoaded: function onClipLoaded(ev, layer) {
		// TODO this won't work.
		if (this.source) {
			this.source.destroy();
		}


		//this.source.source = layer.image;

		this.source = this.seriously.source(layer.image);

		var firstEffect = this.getEffect(0);
		if (firstEffect) {
			firstEffect.source = this.source;
		}

		this.refresh();
	},

	getEffect : function getEffect(idx) {
		var effectLen = this.effects.length;

		if (idx < 0) {
			idx = effectLen + idx;
		} else if (!(idx > 0)) {
			idx = 0;
		}

		if (effectLen > idx) {
			return this.effects[idx];
		}

		return null;
	},

	getOutput : function getOutput() {
		return this.getEffect(-1) || this.source;
	},

	refresh : function refresh() {
		this.target = null;
		//this.seriously.
	}

};

SeriousRenderer.prototype = {};
$.extend(SeriousRenderer.prototype, BaseRenderer.prototype, {
	isSupported : function isSupported() {
		return !Seriously.incompatible();
	},

	/*** 
		Starts the animation rendering.

		Returns true if successful, false if not supported.
	***/
	start : function start() { 
		var self = this,
			lsd = this.lsd,
			canvas = this.canvas,
			layers = this.layers,
			seriously = new Seriously(),
			target = seriously.target(canvas),
			blenders = [seriously.effect('mixer'), seriously.effect('mixer')],
			sources = [],

			refresh = function refresh () {
				// TODO: replace with proper mixer
				var sourceIdx = 0;
				for (var j = 0; j < blenders.length; j++) {
					var blender = blenders[j];

					if (j % 2 === 0) {
						blender.bottom = sources[sourceIdx++].getOutput();
					}
					else {
						blender.bottom = blenders[j - 1];
					}

					blender.top = sources[sourceIdx++].getOutput();
				}

				target.source = blenders[blenders.length - 1];
			},

			makeOnSetOpacity = function makeOnSetOpacity(layer, layerIdx) {

				return function makeOnSetOpacity(ev, opacity) {
					var blenderIdx = layerIdx / 2 | 0,
						blenderSide = (layerIdx % 2 === 0 && layerIdx < 2 ? 'Bottom' : 'Top' );

					if (blenderIdx > 0) {
						blenderSide = 'Top';

						// bottom of any connected blenders are always full blast, since opacity is determined by linked blenders
						blenders[blenderIdx]['opacityBottom'] = 1.0;
					}

					// do something with sources[layerIdx]
					blenders[blenderIdx]['opacity' + blenderSide] = opacity;
					console.log('blenders opacity: layer: ' + layerIdx + ', blender ' + blenderIdx+ ', opa: ' + 'opacity' + blenderSide);
				}; 
			},

			makeOnLoadClip = function makeOnLoadClip(layer, layerIdx) {
 
				return function makeOnLoadClip(ev, vidLayer) {
					layer.onClipLoaded(ev, vidLayer);

					// do something with sources[layerIdx]
					//blender.top = layer.source;
					//blender.bottom = sources[0].source;
					refresh();
				};
			};

		if (!this.isSupported()) return false;


		for (var i in layers) {
			var vidLayer = layers[i],
				layer = new SeriousLayer(seriously, vidLayer);

			sources.push(layer);

			vidLayer
				.bind('layerSetOpacity.lsd', makeOnSetOpacity(layer, i))
				.bind('clipLoaded.lsd', makeOnLoadClip(layer, i));
		}

		this.refresh = refresh;
		refresh();

		seriously.go();

		return true;
	}
});