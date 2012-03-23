//image slider class.
//requires jQuery
ImageSlider.prototype.getSlider = function(e) {
	return $(e).parents(".imageSlider");
};

ImageSlider.prototype.moveRight = function(el) {
	var curImage = el.data("curImage");
	
	if (curImage > 0) {
		el.data("curImage", curImage - 1);
		el.find('.slidingPanel').animate({marginLeft:'+=' + el.data("thumbsWidth") + 'px'}, 500);
	}
	
	this.refreshArrows(el);
	
	return false;
};
ImageSlider.prototype.moveLeft = function(el) {
	var curImage = el.data("curImage");
	
	if (curImage < el.data("maxPages")) {
		el.data("curImage", curImage + 1);
		el.find('.slidingPanel').animate({marginLeft:'-=' + el.data("thumbsWidth") + 'px'}, 500);
	}
	
	this.refreshArrows(el);
	
	return false;
};

ImageSlider.prototype.refreshArrows = function(el) {
	el.find('.next, .previous').removeClass('disabled');
	
	var curImage = el.data("curImage");			
	if (curImage == el.data("maxPages"))
		el.find('.next').addClass('disabled');
	if (curImage == 0) 
		el.find('.previous').addClass('disabled');				
};
//sets up the element el (must be the .imageSlider element of a imageSlider).
function ImageSlider(el, imagesPerSlide, maxPages, thumbClass, thumbWidth) {	
	if (!thumbClass)
		thumbClass = ".galleries";
		
	//set up data: widths, count index, etc.
	var thumb = el.find(thumbClass);
	
	if (!(thumbWidth > 0)) {
		thumbWidth = parseInt(thumb.css("paddingLeft")) + 
					parseInt(thumb.css("paddingRight")) + 
					parseInt(thumb.css("borderLeftWidth")) + 
					parseInt(thumb.css("borderRightWidth")) + 
					parseInt(thumb.css("width")); 		//can't use "thumb.outerWidth();" because images may not be loaded and full size yet.
		thumbWidth += parseInt(thumb.css("marginLeft")) + parseInt(thumb.css("marginRight"));
	}
	
	if (!(maxPages > 0))
		maxPages = Math.floor(thumb.length / imagesPerSlide) - 1;		
	
	el.data("thumbsWidth", thumbWidth * imagesPerSlide);
	el.data("maxPages", Math.max(maxPages, 0));
	el.data("curImage", 0);
	var closure = this;
	
	var onPrev = function(e) {
		var el = closure.getSlider(this);
		return closure.moveRight(el);
	};
	
	var onNext = function(e) {
		var el = closure.getSlider(this);
		return closure.moveLeft(el);
	};
	
	el.find(".previous").click(onPrev);
	el.find(".next").click(onNext);
	
	//add swipe support
	//el.bind('swipe', onNext);
	//el.bind('rightSwipe', onPrev);	
	
	this.refreshArrows(el);
	
	return this;
}