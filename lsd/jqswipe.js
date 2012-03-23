/*!
 * jQswipe v@VERSION - Swipe event for jQuery.
 * http://github.com/dinoboff/jQswipe/
 *
 * Copyright (c) 2009 Damien Lebrun
 * licenced under BSD
 * http://github.com/dinoboff/jQswipe/blob/master/LICENSE
 * 
 * Date: @DATE
 */
 
/**
 * based on "Safari Web Content Guide > Handling Events > Handling Multi-Touch Events"
 * http://bit.ly/Q6uOD
 * 
 * Implement special events as explained by Brandon Aaron:
 * http://brandonaaron.net/blog/2009/03/26/special-events
 */

 (function() {
	var window = this,
		$ = window.jQuery,
		jQswipe = $.jQswipe = {},
		STATE;
	
	/**
	 * Monkey patch to add the touches and targetTouches properties
	 * to jQuery.Event objects.
	 */
	$.each(['touches', 'targetTouches'], function(i, propName){
		if ( $.inArray(propName, $.event.props) < 0 ) {
			$.event.props.push(propName);
		}
	});
	
	/**
	 * Collection of touches - used to record finger position of a swipe
	 */
	jQswipe.Swipe = function(settings) {
		$.extend(this, settings);
	};
	
	STATE = jQswipe.Swipe.STATE = {
		RUNNING: 1,
		ENDED: 2,
		CANCELLED: -1
	};
	
	jQswipe.Swipe.prototype = {
		touches: [],
		type: 'swipe',
		state: null,    // State of the swipe, should be set ot one the jQswipe.Swipe.STATE properties
		minLength: 30,  // How long the swipe should be at least.
		maxWidth: 10,   // How width it can be up to.
		keepLast: 2,    // How many touches should keeped after each upgrad (0 to keep all).
		
		reset: function(touch) {
			this.touches = [];
			this.state = STATE.RUNNING;
		},
		
		/**
		 * Add a touch to the swipe.
		 * 
		 * return the index of the touch (after compression).
		 * 
		 * `touches` should be an array of touch (like window.event.targetTouches).
		 * If there are too many or no touches, the state of the swipe is set to
		 * STATE.CANCELLED and -1 is returned.
		 */
		push: function(touches) {
			var touch;
			
			if (touches.length === 1) {
				touch = touches[0];
			}

			if (touch && touch.pageX !== undefined && touch.pageY !== undefined) {
				this.touches.push({
					pageX: touch.pageX,
					pageY: touch.pageY
				});
				this.compress();
				return this.size() -1;
			}
			
			this.cancel();
			return -1;
		},
		
		/**
		 * return the touches length
		 */
		size: function(touches) {
			return this.touches.length;
		},
		
		/**
		 * Remove old touches.
		 * 
		 * should remove all points except start, previous and current point.
		 */
		compress: function() {
			var length = this.size(),
				cleanUpLength;
				
			if (!this.keepLast || this.keepLast < 1) {
				return;
			}
			
			cleanUpLength = length - this.keepLast - 1;
			if (cleanUpLength > 0) {
				this.touches.splice(1, cleanUpLength);
			}
		},
		
		/**
		 * Return the touch at the giving index.
		 *
		 * Accept negative index (index from the end of the swipe);
		 * e.g., -1 is the last touch of the swipe.
		 */
		atIndex: function(index) {
			var length = this.touches.length;
			
			if (length < 1) {
				return;
			}
			
			index = ((Math.floor(Math.abs(index / length)) +1) * length + index) % length;
			return this.touches[index];
		},
		
		/**
		 * Return the difference on x an y between two touches.
		 */ 
		diff: function(startIndex, endIndex) {
			var startPoint = this.atIndex(startIndex),
				endPoint = this.atIndex(endIndex);
			
			return {
				x: endPoint.pageX - startPoint.pageX,
				y: endPoint.pageY - startPoint.pageY
			};
		},
		
		/**
		 * Validate the swipe. 
		 */
		validate: function() {
			var diffWithStart = this.diff(0, -1),
				diffWithPrevious = this.diff(-2, -1);
			
			// If the swipe has been cancelled in the past,
			// it cannot be valide any more.
			if (this.state === STATE.CANCELLED) {
				return false;
			}
			
			// validate progression
			if (diffWithStart.y > this.maxWidth ||  // Should not be too hight
				diffWithStart.y < -this.maxWidth || // or too low
				diffWithPrevious.x < 0              // should not move back to the left
			) {
				this.cancel();
				return false;
			}
			
			// Validate the comple swipe
			if (this.state === STATE.ENDED && diffWithStart.x < this.minLength) {
				return false;
			}
			
			return true;
		},
		
		cancel: function() {
			this.state = STATE.CANCELLED;
		},
		
		end: function() {
			this.state = STATE.ENDED;
		}
	};
	
		
	
	/**
	 * SwipeSpecialEvent object - special event factory
	 */
	 
	/**
	 * Constructor
	 */
	jQswipe.SwipeSpecialEvent = function(eventType, settings) {
		var that = this;

		this.settings = settings || {};
		this.settings.type = eventType || 'swipe';
		
		this.setup = function(data, namespaces) {
			var $elem = $(this),
				ns = that.prepareNamespaces(namespaces),
				swipe = new $.jQswipe.Swipe(that.settings);
			
			$.each(['touchstart', 'touchmove', 'touchcancel', 'touchend'], function(i, val){
				ns[0] = val;
				$elem.bind(ns.join('.'), swipe, that[val]);
				
				// Remove handler guid (set by jQuery to track handler).
				// We don't need them, we remove event handler using namespace
				delete that[val].guid;
			});
		};
		
		this.teardown = function(namespaces) {
			var $elem = $(this),
				ns = that.prepareNamespaces(namespaces);
			
			$.each(['touchstart', 'touchmove', 'touchcancel', 'touchend'], function(i, val){
				ns[0] = val;
				$elem.unbind(ns.join('.'));
			});
		};
	};
	
	jQswipe.SwipeSpecialEvent.prototype = {
		
		prepareNamespaces: function(swipeNamespaces) {
			var copy = swipeNamespaces.slice(0, swipeNamespaces.length);
			
			copy.splice(0, 0, '', this.settings.type);
			return copy;
		},
		
		/**
		 * Reset the swipe state and add the first touch.
		 */
		touchstart: function(event) {
			var swipe = event.data;
			
			swipe.reset();
			swipe.push(event.targetTouches || []);
		},
		
		/**
		 * Add a new touch if the swipe is still valid
		 */
		touchmove: function(event) {
			var swipe = event.data;
			
			if (swipe.validate()) {
				swipe.push(event.targetTouches || []);
			}
		},
		
		/**
		 * Cancel swipe
		 */
		touchcancel: function(event) {
			var swipe = event.data;
			
			swipe.cancel();
		},
		
		/**
		 * End swipe and trigger the swipe event if the swipe is valid
		 */
		touchend: function(event) {
			var swipe = event.data;
			swipe.end();
			
			if (swipe.validate()) {
				event.type = swipe.type;
				$.event.handle.apply(this, arguments);
			}
		}
	};
	

	/**
	 * Register special swipe event
	 */
	jQswipe.register = function(type, settings) {
		$.event.special[type] = new $.jQswipe.SwipeSpecialEvent(type, settings);
	};

	/**
	 * Register by default a right and left swipe.
	 */
	jQswipe.register('swipe');
	jQswipe.register('rightSwipe');
	jQswipe.register('leftSwipe', {
		validate: function() {
			var diffWithStart = this.diff(0, -1),
				diffWithPrevious = this.diff(-2, -1);
	
			// If the swipe has been cancelled in the past,
			// it cannot be valide any more.
			if (this.state === STATE.CANCELLED) {
				return false;
			}
	
			// validate progression
			if (diffWithStart.y > this.maxWidth ||  // Should not be too hight
				diffWithStart.y < -this.maxWidth || // or too low
				diffWithPrevious.x > 0              // should not move back to the right
			) {
				this.cancel();
				return false;
			}
	
			// Validate the comple swipe
			if (this.state === STATE.ENDED && diffWithStart.x > -(this.minLength)) {
				return false;
			}
	
			return true;
		}
	});
	
	/**
	 * Shortcut for the left swipe. 
	 */
	$.fn.swipe = function(cb) {
		return $(this).bind('swipe', cb);
	};

})();