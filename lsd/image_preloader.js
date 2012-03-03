/* image preloader stolen from 
	http://www.webreference.com/programming/javascript/gr/column3/ 
*/
/* modified by odbol 2010/09/15 to also preload HTML5 videos 
	requires jQuery 1.4
	
	http://odbol.com
*/

//set to true once all the browsers get their events in order.
var USE_MEDIA_OBJECT_EVENTS = true;

VidSource.prototype.url = "";
VidSource.prototype.mimetype = "";
VidSource.prototype.thumbUrl = "";
function VidSource(url, type, thumbUrl) {
	this.url = url;
	this.mimetype = type;
	this.thumbUrl = thumbUrl;
	return this;
}



VidClip.prototype.src; //either a string (image) or array of VidSource objects (video)
//loads a new VidSource object and plays as soon as it's available
VidClip.prototype.thumbnail = ""; //url of a thumbnail image
VidClip.prototype.image = null; //stores the loaded media for caching
VidClip.prototype.load = function (callback) {
	var parentClip = this;
	
	if (this.image) { //already preloaded!
		callback(this.image);
	}
	else {
		var preloader = new ImagePreloader([this.src], function (imgs, numLoaded) {
			parentClip.image = imgs[0];
			callback(parentClip.image);
		});
	}
}
function VidClip(mediaSource, thumbnail) {
	this.thumbnail = thumbnail;
	this.src = mediaSource;
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
ImagePreloader.prototype.preload = function(image)
{
	//test if video or image
	//if (image.test(imgExtensionRegEx)) {
	if (typeof(image) == "string") {
		
			// create new Image object and add to array
			var oImage = new Image;
			this.aImages.push(oImage);
			
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
				vidTag += " style='position:absolute;z-index:-1;'"; //display:none'";
			}
			vidTag += " src='" + image + "' />"

			$("body").append(vidTag);
			//var vid = document.getElementById(tagId);
	}	
	else {
	 	//video: do some wacky HTML5 stuff here.
	 	var tagId = "vidPreload_" + getUniqueNumber();
		var vidTag = "<video";
		if (isDebug) {
			vidTag += " style='position:absolute;z-index:100000;' controls";
		}
		else {
			vidTag += " style='position:absolute;z-index:-1;'"; //display:none'";
		}
		
		vidTag += " id='" + tagId + "' autoplay='true' loop='true'>"
		
		for (i in image) {
			vidTag += "<source src='" + image[i].url + "'";
			if (!this.isAndroidWebkit  //apparently android 2.2 doesn't play video if you include the type attribute. WEAK (src: http://www.broken-links.com/2010/07/08/making-html5-video-work-on-android-phones/)
				&& image[i].mimetype.length > 0)
				vidTag += " type='" + image[i].mimetype + "'";
			vidTag += " />";
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
	}
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
   this.isAndroidWebkit = (/android 2.+webkit/i).test(navigator.userAgent) || (/iOS/).test(navigator.platform);
 
   // for each image, call preload()
   for ( var i = 0; i < images.length; i++ )
      this.preload(images[i]);
}
