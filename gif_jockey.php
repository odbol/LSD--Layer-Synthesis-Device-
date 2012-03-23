<?php 
$pageTitle = "LSD - tim leary meets tim berners-lee";
$navSection = "home";
include("header_head.php"); 
?>

<style type="text/css">
<!--
.elements {
	position: relative;
	left: 0px;
}

.poemLeft, .poemRight {
	float:left;
}
.poemRight {
	width: 415px;
	margin-left: 3px;
}

.poemRight p {
	margin-top: 0;
}
-->
</style>

<!-- used for LSD -->


	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>

	<link rel="stylesheet" type="text/css" media="screen, projection" href="gif_jockey/fd-slider/fd-slider.min.css" />   
    <script src="gif_jockey/fd-slider/js/fd-slider.js"></script>
    
	<!--script type="text/javascript" src="_js/jquery.js"></script-->
	<script src="http://code.jquery.com/jquery-1.5.min.js"></script>
	
	<link type="text/css" href="_js/jquery-ui/css/vader/jquery-ui-1.8.5.custom.css" rel='stylesheet' />	
	<script type="text/javascript" src="_js/jquery-ui/js/jquery-ui.js"></script>

	<!-- script src="/gif_jockey/jqswipe.js" type="text/javascript"></script-->

<!--
<script type='text/javascript'>	
$(document).bind("mobileinit", function(){
	 	$.mobile.autoInitializePage = false;
	$.mobile.linkBindingEnabled = false;
	});

</script>	
<link href="gif_jockey/verticalSlider.css" rel="stylesheet" type="text/css" />

<script src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.js"></script>
<script src="gif_jockey/verticalSlider.js"></script>
	-->
	<link type="text/css" href="gif_jockey/lsd.css" rel='stylesheet' />
    <style type="text/css">
/* odbol fixes for LSD*/
body {
	margin: 0;
	padding: 0;
}

body .element {
	width: 90%;
	max-width: 600px;
	min-width: 300px;
}


.content {
	z-index: 100;
}
.navbar, #logo {
	z-index: 200;
}

    </style>
    
    <!-- facebook share tags (screw the like button! I want my thumbnail in the news feed! -->
    <meta property="og:title" content="Take LSD!" />
	<meta property="og:description" content="Take LSD directly from your browser! LSD (Layer Synthesis Device) allows you to VJ live video on the web using HTML5. Choose video clips and images and blend them together using the mixer controls or the interactive mouse mode. Create your customized hallucination and share with your friends!" />
	<meta property="og:image" content="http://odbol.com/gif_jockey/icons/stamp-lsd-114.png" />
	<!-- end facebook share tags -->
	
	<link rel="icon" type="image/png" href="/gif_jockey/icons/stamp-lsd-16.png" />
	
	<!-- iphone app icons -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="apple-touch-icon-precomposed" href="/gif_jockey/icons/stamp-lsd-57.png" />
	<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/gif_jockey/icons/stamp-lsd-72.png" />
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/gif_jockey/icons/stamp-lsd-114.png" />
	<link rel="apple-touch-startup-image" href="/gif_jockey/icons/stamp-lsd-startup.png">
	
	<!-- END iphone app icons -->	
	
    <!-- END used for LSD -->



</head>

<body>
	<div class='intro element'>
		<h2>LSD (Layer Synthesis Device)</h2>
		<h3>VJing in pure HTML5</h3>
		
		<p><strong>LSD should take effect in a moment...</strong></p>
		
		
		<div class='waitingDesc'>
		<p>Use LSD to VJ live video on the web! Choose video clips and images and blend them together using the mixer controls
		or the interactive mouse mode. Create your customized hallucination directly in your browser and share with your friends!</p>
		
		<p>LSD is a proof-of-concept application to demonstrate the new video and 2D rendering capabilities of HTML5 and the Canvas element. 
		Use it on a fast browser like Safari or Chrome and you will see UI responsiveness and smoothness comparable to professional VJ software (eh, at low resolutions).
		Of course, the browsers still have a long way to get up to the speed of a native application, but it is a promising start.
		(You can even VJ on your phone! Come on, this must be the future already!)</p>
		
		<p>Supported on Firefox 3.5+, Safari 4+, Chrome, iPhone, Android (no IE, what a surprise...)</p>
		<p>Code and content copyright <a href="http://odbol.com">odbol</a>, 2010<br />
		<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><br /><span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/MovingImage" property="dc:title" rel="dc:type">LSD (Layer Synthesis Device)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com/lsd" property="cc:attributionName" rel="cc:attributionURL">Tyler Freeman</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.<br />Permissions beyond the scope of this license may be available at <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com/" rel="cc:morePermissions">http://odbol.com/</a>.</p>
		</div>
		
		<noscript>
			<p>Please enable Javascript for LSD to take effect.</p>
		</noscript>
	</div>
	
	<script type="text/javascript">
		//the end-all test
		var isMobile = (/android.+webkit/i).test(navigator.userAgent) || (/iPad|iPhone|iPod/).test(navigator.platform);

		//inject jQuery mobile for vertical slider fix
		if (isMobile) {
		
		}
	</script>
	
	<!-- collaborative support -->
	<script type='text/javascript' src='http://static.firebase.com/v0/firebase.js'></script>
    <script type="text/javascript" src="gif_jockey/crowd.js"></script>
	

    <script type="text/javascript" src="gif_jockey/image_preloader.js"></script>
    <script type="text/javascript" src="gif_jockey/imageSlider.js"></script> 
    <script type="text/javascript" src="gif_jockey/lsd.js"></script>

	<script type="text/javascript">
		$(function(){

<?php
//generate user id : TODO - ask for id!
echo "var userId = 'vj" . str_replace('.', '', $_SERVER['REMOTE_ADDR']) . "';";


?>


		//just use my favorites!
			var compositeTypes = ['lighter','darker', 'xor', 'source-over', 'destination-over'];

			//images to be rendered
			var bgs = [
<?php
//detect clip urls from querystring
for ($i = 0; $i < 3; $i++) {
	$clipUrl = $_GET["clip$i"];
	if ($clipUrl && strlen($clipUrl) > 0) {
		$clipType = $_GET["type$i"];
		$clipThumb = $_GET["img$i"];
		if (!$clipThumb)
			$clipThumb = "gif_jockey/lsd_thumb.jpg";
		
		print "\n\t\t\tnew VidClip([new VidSource('$clipUrl', '$clipType')], '$clipThumb'),";
	}
}
?>

					new VidClip([new VidSource("images/mixer/240p/fish_jelly_purple.mp4", "video/mp4"), 
						new VidSource("images/mixer/240p/fish_jelly_purple.ogg", "video/ogg")], "images/mixer/thumbs/fish_jelly_purple.jpg"),
					new VidClip("images/mixer/red_spiderweb.png","images/mixer/thumbs/red_spiderweb.jpg"), 
					new VidClip("images/mixer/dark_clouds.png","images/mixer/thumbs/dark_clouds.jpg")
				];	
			
			//holds all the possible clips to play
			var vidClips = bgs.concat([
				new VidClip([new VidSource("images/mixer/240p/redbuggy_trim.mp4", "video/mp4"), 
								new VidSource("images/mixer/240p/redbuggy_trim.ogg", "video/ogg")],
								"images/mixer/thumbs/redbuggy.jpg"),
				new VidClip([new VidSource("images/mixer/240p/chess_dance.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/chess_dance.ogg", "video/ogg")], "images/mixer/thumbs/chess_dance.jpg"),
				new VidClip([new VidSource("images/mixer/240p/clouds_happy_sunset_SHORTLOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/clouds_happy_sunset_SHORTLOOP.ogg", "video/ogg")], "images/mixer/thumbs/clouds_happy_sunset_SHORTLOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/winter_icicle_drip_LOOP.mp4", "video/mp4"), 
							new VidSource("images/mixer/240p/winter_icicle_drip_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/winter_icicle_drip_LOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fence_moma_LOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fence_moma_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/fence_moma_LOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fish_big_spinner_LOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_big_spinner_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/fish_big_spinner_LOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fish_blue_LONG.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_blue_LONG.ogg", "video/ogg")], "images/mixer/thumbs/fish_blue_LONG.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fish_jelly_orange.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_jelly_orange.ogg", "video/ogg")], "images/mixer/thumbs/fish_jelly_orange.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fish_tiny_LONG.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_tiny_LONG.ogg", "video/ogg")], "images/mixer/thumbs/fish_tiny_LONG.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fish_tropical_VERT_LOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_tropical_VERT_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/fish_tropical_VERT_LOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fish_water_reflections.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_water_reflections.ogg", "video/ogg")], "images/mixer/thumbs/fish_water_reflections.jpg"),
				new VidClip([new VidSource("images/mixer/240p/tz_firedance3full-6fps.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/tz_firedance3full-6fps.ogg", "video/ogg")], "images/mixer/thumbs/tz_firedance3full-6fps.jpg"),
	/*			new VidClip([new VidSource("images/mixer/240p/union_square640x480.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/union_square640x480.ogg", "video/ogg")], "images/mixer/thumbs/union_square640x480.jpg"),
	*/			
				new VidClip([new VidSource("images/mixer/240p/driving_night_streaks.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/driving_night_streaks.ogg", "video/ogg")], "images/mixer/thumbs/driving_night_streaks.jpg"),
				new VidClip([new VidSource("images/mixer/240p/union_square_tilt_shift.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/union_square_tilt_shift.ogg", "video/ogg")], "images/mixer/thumbs/union_square_tilt_shift.jpg"),
				new VidClip("images/mixer/bermuda_eyehole.png", "images/mixer/thumbs/bermuda_eyehole.jpg"),
				
				//gif jockey
new VidClip("images/mixer/gif/Agnex.gif", "images/mixer/gif/thumb/Agnex.jpg"),
new VidClip("images/mixer/gif/Dominoes.gif", "images/mixer/gif/thumb/Dominoes.jpg"),
new VidClip("images/mixer/gif/Exploding-head.gif", "images/mixer/gif/thumb/Exploding-head.jpg"),
new VidClip("images/mixer/gif/Fire_Works____by_MattTheSamurai.gif", "images/mixer/gif/thumb/Fire_Works____by_MattTheSamurai.jpg"),

new VidClip("images/mixer/gif/Popcorn_decepticon.gif", "images/mixer/gif/thumb/Popcorn_decepticon.jpg"),
new VidClip("images/mixer/gif/adam_harms.gif", "images/mixer/gif/thumb/adam_harms.jpg"),
new VidClip("images/mixer/gif/artichoke.gif", "images/mixer/gif/thumb/artichoke.jpg"),
new VidClip("images/mixer/gif/atom_b.gif", "images/mixer/gif/thumb/atom_b.jpg"),
new VidClip("images/mixer/gif/ballonface.gif", "images/mixer/gif/thumb/ballonface.jpg"),
new VidClip("images/mixer/gif/balloon-face.gif", "images/mixer/gif/thumb/balloon-face.jpg"),
new VidClip("images/mixer/gif/barrel-eater.gif", "images/mixer/gif/thumb/barrel-eater.jpg"),
new VidClip("images/mixer/gif/bb-v-bubble.gif", "images/mixer/gif/thumb/bb-v-bubble.jpg"),
new VidClip("images/mixer/gif/break_dancing.gif", "images/mixer/gif/thumb/break_dancing.jpg"),
new VidClip("images/mixer/gif/break_glass.gif", "images/mixer/gif/thumb/break_glass.jpg"),
new VidClip("images/mixer/gif/bill_cosby-jello.gif", "images/mixer/gif/thumb/bill_cosby-jello.jpg"),
new VidClip("images/mixer/gif/5OXea.gif", "images/mixer/gif/thumb/5OXea.jpg"),
new VidClip("images/mixer/gif/buffalo.gif", "images/mixer/gif/thumb/buffalo.jpg"),
new VidClip("images/mixer/gif/burn-fall.gif", "images/mixer/gif/thumb/burn-fall.jpg"),
new VidClip("images/mixer/gif/can-i-helllp-yazxmcn.gif", "images/mixer/gif/thumb/can-i-helllp-yazxmcn.jpg"),
new VidClip("images/mixer/gif/cat-slide.gif", "images/mixer/gif/thumb/cat-slide.jpg"),
new VidClip("images/mixer/gif/cat_twitchy.gif", "images/mixer/gif/thumb/cat_twitchy.jpg"),
new VidClip("images/mixer/gif/chewin_gum.gif", "images/mixer/gif/thumb/chewin_gum.jpg"),
new VidClip("images/mixer/gif/chopm.gif", "images/mixer/gif/thumb/chopm.jpg"),
new VidClip("images/mixer/gif/cops_overload.gif", "images/mixer/gif/thumb/cops_overload.jpg"),
new VidClip("images/mixer/gif/dancing_lady_turns_into_rolling_beast.gif", "images/mixer/gif/thumb/dancing_lady_turns_into_rolling_beast.jpg"),
new VidClip("images/mixer/gif/dogfighter.gif", "images/mixer/gif/thumb/dogfighter.jpg"),
new VidClip("images/mixer/gif/eat.gif", "images/mixer/gif/thumb/eat.jpg"),
new VidClip("images/mixer/gif/eyes.gif", "images/mixer/gif/thumb/eyes.jpg"),
new VidClip("images/mixer/gif/fisheat.gif", "images/mixer/gif/thumb/fisheat.jpg"),
new VidClip("images/mixer/gif/glacier.gif", "images/mixer/gif/thumb/glacier.jpg"),
new VidClip("images/mixer/gif/golf_ball.gif", "images/mixer/gif/thumb/golf_ball.jpg"),
new VidClip("images/mixer/gif/headscan.gif", "images/mixer/gif/thumb/headscan.jpg"),
new VidClip("images/mixer/gif/hmuon.gif", "images/mixer/gif/thumb/hmuon.jpg"),
new VidClip("images/mixer/gif/hoop_girl.gif", "images/mixer/gif/thumb/hoop_girl.jpg"),
new VidClip("images/mixer/gif/jupiter-surface-motion.gif", "images/mixer/gif/thumb/jupiter-surface-motion.jpg"),
new VidClip("images/mixer/gif/licklol.gif", "images/mixer/gif/thumb/licklol.jpg"),
new VidClip("images/mixer/gif/light_blub_vs_mousetrap.gif", "images/mixer/gif/thumb/light_blub_vs_mousetrap.jpg"),
new VidClip("images/mixer/gif/lightning.gif", "images/mixer/gif/thumb/lightning.jpg"),
new VidClip("images/mixer/gif/man_rides_WTF.gif", "images/mixer/gif/thumb/man_rides_WTF.jpg"),
new VidClip("images/mixer/gif/neti.gif", "images/mixer/gif/thumb/neti.jpg"),
new VidClip("images/mixer/gif/pineapple-mri.gif", "images/mixer/gif/thumb/pineapple-mri.jpg"),
new VidClip("images/mixer/gif/punchbuggy.jpg", "images/mixer/gif/punchbuggy.jpg"),
new VidClip("images/mixer/gif/rainbow.gif", "images/mixer/gif/thumb/rainbow.jpg"),
new VidClip("images/mixer/gif/served.gif", "images/mixer/gif/thumb/served.jpg"),
new VidClip("images/mixer/gif/solar_flare.gif", "images/mixer/gif/thumb/solar_flare.jpg"),
new VidClip("images/mixer/gif/spin_hat_loop.gif", "images/mixer/gif/thumb/spin_hat_loop.jpg"),
new VidClip("images/mixer/gif/stream_of_dots.gif", "images/mixer/gif/thumb/stream_of_dots.jpg"),
new VidClip("images/mixer/gif/subway_14th_st_loop.gif", "images/mixer/gif/thumb/subway_14th_st_loop.jpg"),
new VidClip("images/mixer/gif/subway_endless.gif", "images/mixer/gif/thumb/subway_endless.jpg"),
new VidClip("images/mixer/gif/swimming.gif", "images/mixer/gif/thumb/swimming.jpg"),
new VidClip("images/mixer/gif/torus_of_arms.gif", "images/mixer/gif/thumb/torus_of_arms.jpg"),
new VidClip("images/mixer/gif/tumblrlbfo7jbvr91qzpwi0.gif", "images/mixer/gif/thumb/tumblrlbfo7jbvr91qzpwi0.jpg"),
new VidClip("images/mixer/gif/us_takeover.gif", "images/mixer/gif/thumb/us_takeover.jpg"),
new VidClip("images/mixer/gif/walkin1.gif", "images/mixer/gif/thumb/walkin1.jpg"),
new VidClip("images/mixer/gif/xray_body-mri.gif", "images/mixer/gif/thumb/xray_body-mri.jpg") 

				]); //copy array and add more!
	
	
	  
   
   	
	
			$().takeLSD(vidClips, compositeTypes, null, userId);				

		});
	</script>	
</body>
</html>
