LSD (Layer Synthesis Device)
VJing in pure HTML5
http://odbol.com/lsd
		
Use LSD to VJ live video on the web! Choose video clips and images and blend them together using the mixer controls
or the interactive mouse mode. Create your customized hallucination directly in your browser and share with your friends!
		
LSD is a proof-of-concept application to demonstrate the new video and 2D rendering capabilities of HTML5 and the Canvas element. 
Use it on a fast browser like Safari or Chrome and you will see UI responsiveness and smoothness comparable to professional VJ software (eh, at low resolutions).
Of course, the browsers still have a long way to get up to the speed of a native application, but it is a promising start.
(You can even VJ on your phone! Come on, this must be the future already!)
		
Supported on Firefox 3.5+, Safari 4+, Chrome, iPhone, Android (no IE, what a surprise...)

Code and content copyright Tyler Freeman, 2010
Code is licensed under the GPL: please see lsd/COPYING.txt for more info.
Media Content (videos and images) is licensed under Creative Commons BY-NC-SA ( http://creativecommons.org/licenses/by-nc-sa/3.0/ )

FAQ:

* How do I play my videos? What codecs are supported? 

Unfortunately, each browser supports different codecs for HTML5 videos. You can check the supported ones here: 

http://diveintohtml5.org/video.html

I'd recommend using MPEG Streamclip to convert your videos to H.264 MP4, so you can use them on Chrome and Safari. Firefox uses Ogg; you'll have to encode separate files for both if you want it to work on all browsers.
The takeLSD() function accepts arrays of VidSource objects in case you have multiple encodings of the same video for different browsers. See the index.html file for an example.

* Animated GIFS no longer animate for me?

Yes, this is a bug in newer versions of Chrome and all versions of Firefox. 

Shame that it used to work on Chrome and they broke it. If you would like them to fix it, please star or re-open these bugs:

Chrome - http://code.google.com/p/chromium/issues/detail?id=161407
Firefox - https://bugzilla.mozilla.org/show_bug.cgi?id=666855