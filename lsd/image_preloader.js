/* image preloader stolen from 
	http://www.webreference.com/programming/javascript/gr/column3/ 
*/
/* modified by odbol 2010/09/15 to also preload HTML5 videos 
	requires jQuery 1.4
	
	http://odbol.com
*/

//set to true once all the browsers get their events in order.
var USE_MEDIA_OBJECT_EVENTS = true,

	// firefox doesn't support animating GIFs in canvas.
	// in fact, chrome doesn't either since v23. what is the world coming to?
	hasGifSupport = isMobile && (navigator.userAgent.indexOf('Firefox') < 0);




VidSource.prototype.url = "";
VidSource.prototype.mimetype = "";
VidSource.prototype.thumbUrl = "";
VidSource.prototype.isVideo = function isVideo() {
	return (this.mimetype.indexOf('image/') < 0);
};
// returns an animated GIF source, or falls back on thumbnail if GIF not provided
VidSource.prototype.getImage = function getImage() {
	if (this.isVideo()) {
		return this.thumbUrl; 
	}
	else {
		return this.url;
	}
};
function VidSource(url, type, thumbUrl) {
	this.url = url;
	this.mimetype = type;
	this.thumbUrl = thumbUrl;
	return this;
}



VidClip.prototype.src = null; //either a string (image) or array of VidSource objects (video)
//loads a new VidSource object and plays as soon as it's available
VidClip.prototype.thumbnail = ""; //url of a thumbnail image
VidClip.prototype.image = null; //stores the loaded media for caching
VidClip.prototype.id = "empty"; //identifies by index
VidClip.prototype.element = null; //the gui element associated with this clip (not the actual image src!)
VidClip.prototype.rating = 1000; //default rating, used for filtering
VidClip.prototype.getGif = function getGif() {
	// try to find animated GIF version
	for (var i = 0; i < this.src.length; i++) {
		
		if (!this.src[i].isVideo()) {
			return this.src[i];
		}
	}
	return null;
}
VidClip.prototype.load = function (callback) {
	var parentClip = this;
	
	if (this.image) { //already preloaded!
		callback(this.image);
	}
	else {
		var preloader = new ImagePreloader([this], function (imgs, numLoaded) {
			parentClip.image = imgs[0];

			callback(parentClip.image);
		});
	}
};
VidClip.prototype.isVideo = function () {
	return ( typeof(this.src) !== "string" );
};
function VidClip(mediaSource, thumbnail, rating) {
	this.thumbnail = thumbnail;
	
	// for backwards compatibility, create a image VidSource from strings of a GIF passed in
	if (typeof(mediaSource) === "string" ) {
		this.src = [new VidSource(mediaSource, 'image/gif', thumbnail)];
	}
	else {
		this.src = mediaSource;
	}
	
	//mobile can't handle videos, so find image version
	if ( isMobile ) {
		var gifSrc = this.getGif(); // fallback to thumb as placeholder

		if (!gifSrc) {
			gifSrc = thumbnail;
		}
		
		this.src = gifSrc;
	}

	
	this.id = thumbnail; //TODO: use something else?
	
	if (rating > 0)
		this.rating = rating;
	
	return this;
}




var uniqueNumber = 0;
function getUniqueNumber() {
	return uniqueNumber++;
}


ImagePreloader.prototype.isAndroidWebkit = false; //set to true if browser is Android 2.2, to fix the video tag bug.
//ImagePreloader.prototype.imgExtensionRegEx = /\.(jpg|gif|png)$/i;
//pass single string to load as image, pass array of VidSource objects to load as video, 
//each array element being another fallback codec.
ImagePreloader.prototype.preload = function(vidClip)
{
	//test if video or image (backwards compaitibility
	//if (image.test(imgExtensionRegEx)) {
	if (typeof(vidClip.src) == "string") {
		this.loadGif(vidClip.src);
	}
	else {
		// load GIFs if we have them (since that usually indicates they are original source),
		// unless its firefox. firefox doesn't support animating GIFs in canvas.
		var gif = vidClip.getGif();
		
		if (gif && (hasGifSupport ||
					// if it only has a GIF, it's probably a static image, which is ok to load in this case
					vidClip.src.length == 1)) { 

			this.loadGif(gif.src || gif.url); // WTF???
		}
		else {
			this.loadVideos(vidClip.src);
		}
	}
};

ImagePreloader.prototype.loadGif = function loadGif(image) {
	// create new Image object and add to array
	var oImage = new Image();
	//this.aImages.push(oImage);
	
	// set up event handlers for the Image object
	oImage.onload = ImagePreloader.prototype.onload;
	oImage.onerror = ImagePreloader.prototype.onerror;
	oImage.onabort = ImagePreloader.prototype.onabort;
	
	// assign pointer back to this.
	oImage.oImagePreloader = this;
	//oImage.bLoaded = false;
	
	// assign the .src property of the Image object
	oImage.src = image;

	//this doesn't work in safari/webkit for animated gifs
	//so must have image being shown
	var tagId = "vidPreload_" + getUniqueNumber();
	var vidTag = "<img id='" + tagId + "'";
	if (isDebug) {
		vidTag += " style='position:absolute;z-index:100000;'";
	}
	else {
		vidTag += " style='position:absolute;z-index:-1;width:10px;height:10px;'"; //display:none'";
	}
	vidTag += " src='" + image + "' />"

	$("body").append(vidTag);
	//var vid = document.getElementById(tagId);
	this.aImages.push( document.getElementById(tagId) );
};

ImagePreloader.prototype.loadVideos = function loadVideos(image) {
	//video: do some wacky HTML5 stuff here.
	var tagId = "vidPreload_" + getUniqueNumber();
	var vidTag = "<video";
	if (isDebug) {
		vidTag += " style='position:absolute;z-index:100000;' controls";
	}
	else {
		vidTag += " style='position:absolute;z-index:-1;width:10px;height:10px;'"; //display:none'";
	}
	
	vidTag += " id='" + tagId + "' autoplay='true' loop='true'>"
	
	for (i in image) {
		if (image[i].isVideo()) {
			vidTag += "<source src='" + image[i].url + "'";
			if (!this.isAndroidWebkit  //apparently android 2.2 doesn't play video if you include the type attribute. WEAK (src: http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/)
				&& image[i].mimetype.length > 0)
				vidTag += " type='" + image[i].mimetype + "'";
			vidTag += " />";
		}
	}
	vidTag += "</video>"

	$("body").append(vidTag);
	var vid = document.getElementById(tagId);
	this.aImages.push(vid);

	// set up event handlers for the Image object
	//who has implemented these yet?
	if (USE_MEDIA_OBJECT_EVENTS) {
		// assign pointer back to this.
		vid.oImagePreloader = this;
		
	/*
		$("#" + tagId).bind('play', ImagePreloader.prototype.onload)
			.bind('error', ImagePreloader.prototype.onerror)
			.bind('abort', ImagePreloader.prototype.onabort);
			*/
		vid.addEventListener("play", ImagePreloader.prototype.onload, false);
		vid.addEventListener("error", ImagePreloader.prototype.onerror, false);
		vid.addEventListener("abort", ImagePreloader.prototype.onabort, false);

		//fix for FF 3.5 loop broken (https://bugzilla.mozilla.org/show_bug.cgi?id=449157)
		if (!vid.loop) {
			vid.loop = true; //FF just doesn't get it!
			
			$(vid).bind('ended',{},function() {
				if (this.loop) {
					$(this).trigger('play');
				}
			});
		}
		
		if (this.isAndroidWebkit)
			vid.play(); //autoload! (also fixes android 2.2 bug)
	}
	else {
		//hack past it and hope it's loaded in time!
		ImagePreloader.prototype.onload();
	}
	
		
		
/*
if(!isNaN(video.duration)){
		if(SOURCERECT.width == 0){
			SOURCERECT = {x:0,y:0,width:video.videoWidth,height:video.videoHeight};
			createTiles();
		}
		//this is to keep my sanity while developing
		if(randomJump){
			randomJump = false;
			video.currentTime = Math.random()*video.duration;
		}
		//loop
		if(video.currentTime == video.duration){
			video.currentTime = 0;
		}
		*/
};
 
ImagePreloader.prototype.onComplete = function(e)
{
   this.nProcessed++;
   if ( this.nProcessed == this.nImages )
   {
      this.callback(this.aImages, this.nLoaded);
   }
};
ImagePreloader.prototype.onload = function(e)
{
   //this.bLoaded = true;
   this.oImagePreloader.nLoaded++;
   this.oImagePreloader.onComplete();
};
ImagePreloader.prototype.onerror = function(e)
{
   //this.bError = true;
   this.oImagePreloader.onComplete();
};
ImagePreloader.prototype.onabort = function(e)
{
   //this.bAbort = true;
   this.oImagePreloader.onComplete();
};

/* accepts an array of VidSource objects to preload */
function ImagePreloader(images, callback)
{
   // store the callback
   this.callback = callback;
 
   // initialize internal state.
   this.nLoaded = 0;
   this.nProcessed = 0;
   this.aImages = new Array;
 
   // record the number of images.
   this.nImages = images.length;
   
   //mobile browser workarounds
   this.isAndroidWebkit = isMobile;
 
   // for each image, call preload()
   for ( var i = 0; i < images.length; i++ )
      this.preload(images[i]);
}
