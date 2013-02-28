LSD (Layer Synthesis Device)
Collaborative Realtime Video Remixing
http://lsd.odbol.com
		
Use LSD to VJ live video on the web! Choose video clips and images and blend them together using the mixer controls
or the interactive mouse mode. Create your customized hallucination directly in your browser and share with your friends!
		
LSD is a proof-of-concept application to demonstrate the new video and 2D rendering capabilities of HTML5 and the Canvas element. 
Use it on a fast browser like Firefox or Chrome and you will see UI responsiveness and smoothness comparable to professional VJ software (eh, at low resolutions).
Of course, the browsers still have a long way to get up to the speed of a native application, but it is a promising start.
(You can even VJ on your phone! Come on, this must be the future already!)
		
Supported on Firefox 3.5+, Safari 4+, Chrome, iPhone, Android (no IE, what a bummer...)

Code and content copyright Tyler Freeman, 2010-2013
Code is licensed under the GPL: please see lsd/COPYING.txt for more info.
Media Content is licensed under Creative Commons BY-NC-SA ( http://creativecommons.org/licenses/by-nc-sa/3.0/ ) or as marked.


FAQ
===================

* How do I play my videos? What codecs are supported? 

Unfortunately, each browser supports different codecs for HTML5 videos. You can check the supported ones here: 

http://diveintohtml5.org/video.html

I'd recommend using MPEG Streamclip to convert your videos to H.264 MP4, so you can use them on Chrome and Safari. Firefox uses Ogg; you'll have to encode separate files for both if you want it to work on all browsers.
The takeLSD() function accepts arrays of VidSource objects in case you have multiple encodings of the same video for different browsers. See the index.html file for an example.



DEVELOPMENT ROADMAP
===================

* Add more InputDevices (VJacket, LeapMotion, Kinect, MIDI, OSC, etc.)
* Add more Seriously effects (especially Generators)
* Rewrite all the hackathoned hacky hack code with some backbone.js and templates.