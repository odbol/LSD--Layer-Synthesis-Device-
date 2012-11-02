// minimal underscore.js functions
var _ = {};
(function (_) {
  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

	// Create quick reference variables for speed access to core prototypes.
  var push             = ArrayProto.push,
      slice            = ArrayProto.slice,
      concat           = ArrayProto.concat,
      unshift          = ArrayProto.unshift,
      toString         = ObjProto.toString,
      hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;
    
  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Binding with arguments is also known as `curry`.
  // Delegates to **ECMAScript 5**'s native `Function.bind` if available.
  // We check for `func.bind` first, to fail fast when `func` is undefined.
  _.bind = function bind(func, context) {
    var bound, args;
    if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    //if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };
})(_);

(function( $ ){

	var DocStep = function DocStep(doc, opts) { 
			this.init(doc, opts);
		};
	
	
	DocStep.prototype = {
		numTipsOpen : 0,
		opts : {},
	
		init : function init(doc, opts) {
			var self = this,
				placement = opts.placement || { top: { direction: 'down', bounce: true } };
			
			this.doc = doc;
			this.opts = opts;
			
			this.opts.delay || (this.opts.delay = 0); // assignment
			this.opts.cssClass || (this.opts.cssClass = ''); // assignment
			this.opts.tooltip || (this.opts.tooltip = {}); // assignment
			
			this.name = opts.name;
			
			this.onHide = _.bind(this.onHide, this);
			this.show = _.bind(this.show, this);
			
			this.$el = $(opts.elements);
			
			this.tips = [];
			
			//tooltipOpts = $.extend(
			
			this.$el.each(function () {
				self.tips.push(
					$(this).tooltip({
						tipClass : 'docTooltip ' + opts.cssClass,
						events : {
							def:     "focus.tooltip,click.tooltip",
							tooltip: "none,click.tooltip"
						},
						predelay: 30,
						layout: "<div></div>",
						onHide: this.onHide,
						
						position : opts.tooltip.position,
						offset : opts.tooltip.offset
					})
						// add dynamic plugin with optional configuration for bottom edge
						//.dynamic(placement)
						.data('tooltip')
				);
			});
				
			
			if (opts.once) {
				$(opts.once).click(self.show);
			}
		},
		
		show : function show() {
			var self = this;
			
			setTimeout(function () {
				for (var i = 0; i < self.tips.length; i++) {
					self.tips[i].show();
				}
			}, this.opts.delay);
			
			this.numTipsOpen = this.tips.length;
			
			$(this.doc).triggerHandler('show.doc', [this.opts.name]);
		},
		
		onHide : function onHide() {
			if (--this.numTipsOpen <= 0) {
				this.finish();
			}
		},
		
		
		finish : function finish() {
			$(this.doc).triggerHandler('done.doc', [this]);
		
			switch (typeof this.opts.done) {
				case 'string':
					this.doc.show(this.opts.done);
					
					break;
				case 'Object':
				
					this.doc.show(this.opts.done.name);
					break;
			}
		}
	};
	
	
	var	Documentationeer = function Documentationeer(steps) {
			this.steps = {};
		
			this.add(steps);
		};
		
	Documentationeer.prototype = {
		add: function add(steps) {
			if (steps) {
				for (var i = 0; i < steps.length; i++) {
					var stepOptions = steps[i],
						step = new DocStep(this, stepOptions);
					
					this.steps[step.name] = step;
				}
			}
		},
	
		show: function show(name) {
			if (!name) return; // protect against stupid jQuery event trigger calling willy-nilly any function of the same name.
			
			this.steps[name].show();
									
			$(this).trigger('show.doc', [name]);
		},
		
		subscribe : function subscribe(stepName, eventName, callback) {
			$(this).bind(eventName + '.doc', function (ev, name) {
				if (stepName == name) {
					callback(name);
				}
			});
		}
	};


	var doc = null;
	
	// initializes documentation tooltips 
	$.fn.documentate = function(steps) {
		if (doc) {
			doc.add(steps);
		}
		else {
			doc = new Documentationeer(steps);
		}
		
		return doc;
	}
   

})( jQuery );