<?php 
$pageTitle = "LSD - tim leary meets tim berners-lee";
$navSection = "home";
include("header_head.php"); 
?>

<style type="text/css">
<!--
html body {
	background-image: none;
}

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

	<link rel="stylesheet" type="text/css" media="screen, projection" href="joke/fd-slider/fd-slider.min.css" />   
    <script src="joke/fd-slider/js/fd-slider.js"></script>
    
	<!--script type="text/javascript" src="_js/jquery.js"></script-->
	<script src="http://code.jquery.com/jquery-1.5.min.js"></script>
	
	<link type="text/css" href="_js/jquery-ui/css/vader/jquery-ui-1.8.5.custom.css" rel='stylesheet' />	
	<script type="text/javascript" src="_js/jquery-ui/js/jquery-ui.js"></script>

	<!-- script src="/joke/jqswipe.js" type="text/javascript"></script-->

<!--
<script type='text/javascript'>	
$(document).bind("mobileinit", function(){
	 	$.mobile.autoInitializePage = false;
	$.mobile.linkBindingEnabled = false;
	});

</script>	
<link href="joke/verticalSlider.css" rel="stylesheet" type="text/css" />

<script src="http://code.jquery.com/mobile/1.0.1/jquery.mobile-1.0.1.js"></script>
<script src="joke/verticalSlider.js"></script>
	-->
	<link type="text/css" href="joke/lsd.css" rel='stylesheet' />
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
	<meta property="og:image" content="http://odbol.com/joke/icons/stamp-lsd-114.png" />
	<!-- end facebook share tags -->
	
	<link rel="icon" type="image/png" href="/joke/icons/stamp-lsd-16.png" />
	
	<!-- iphone app icons -->
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="apple-mobile-web-app-status-bar-style" content="black" />
	<link rel="apple-touch-icon-precomposed" href="/joke/icons/stamp-lsd-57.png" />
	<link rel="apple-touch-icon-precomposed" sizes="72x72" href="/joke/icons/stamp-lsd-72.png" />
	<link rel="apple-touch-icon-precomposed" sizes="114x114" href="/joke/icons/stamp-lsd-114.png" />
	<link rel="apple-touch-startup-image" href="/joke/icons/stamp-lsd-startup.png">
	
	<!-- END iphone app icons -->	
	
    <!-- END used for LSD -->

	<!--- for music player -->
	<link type="text/css" href="joke/musicPlayer.css" rel='stylesheet' />

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
		<p>Code and video content copyright <a href="http://odbol.com">odbol</a>, 2010<br />
		<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-nc-sa/3.0/88x31.png" /></a><br /><span xmlns:dc="http://purl.org/dc/elements/1.1/" href="http://purl.org/dc/dcmitype/MovingImage" property="dc:title" rel="dc:type">LSD (Layer Synthesis Device)</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com/lsd" property="cc:attributionName" rel="cc:attributionURL">Tyler Freeman</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.<br />Permissions beyond the scope of this license may be available at <a xmlns:cc="http://creativecommons.org/ns#" href="http://odbol.com/" rel="cc:morePermissions">http://odbol.com/</a>.</p>
		<br />GIFs by <a href='http://lcky.tumblr.com/' target='_blank'>Adam Harms</a>, <a href='http://dvdp.tumblr.com/' target='_blank'>David Ope</a>, and unknown sources.
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
    <script type="text/javascript" src="joke/crowd.js"></script>
	

    <script type="text/javascript" src="joke/image_preloader.js"></script>
    <script type="text/javascript" src="joke/imageSlider.js"></script> 
    <script type="text/javascript" src="joke/lsd.js"></script>

	<!-- for music integration -->
	<script type="text/javascript" src="http://popcornjs.org/code/dist/popcorn.min.js"></script>
	<script type="text/javascript" src="joke/musicPlayer.js"></script>
	

	<script type="text/javascript">
		$(function(){

<?php
//generate default user id 
echo "var userId = 'VJ " . str_replace('.', '', $_SERVER['REMOTE_ADDR']) . "';";


?>


		//just use my favorites!
			var compositeTypes = ['lighter','darker', 'xor'];//, 'source-over', 'destination-over'];

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
			$clipThumb = "joke/lsd_thumb.jpg";
		
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
				new VidClip([new VidSource("images/mixer/240p/fish_jelly_orange.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_jelly_orange.ogg", "video/ogg")], "images/mixer/thumbs/fish_jelly_orange.jpg"),
				new VidClip([new VidSource("images/mixer/240p/chess_dance.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/chess_dance.ogg", "video/ogg")], "images/mixer/thumbs/chess_dance.jpg"),
				new VidClip([new VidSource("images/mixer/240p/clouds_happy_sunset_SHORTLOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/clouds_happy_sunset_SHORTLOOP.ogg", "video/ogg")], "images/mixer/thumbs/clouds_happy_sunset_SHORTLOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/fence_moma_LOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fence_moma_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/fence_moma_LOOP.jpg"),
				new VidClip([new VidSource("images/mixer/240p/tz_firedance3full-6fps.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/tz_firedance3full-6fps.ogg", "video/ogg")], "images/mixer/thumbs/tz_firedance3full-6fps.jpg"),
	
	
	
	

				new VidClip([new VidSource("images/mixer/240p/fish_big_spinner_LOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_big_spinner_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/fish_big_spinner_LOOP.jpg", 500),
				new VidClip([new VidSource("images/mixer/240p/fish_blue_LONG.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_blue_LONG.ogg", "video/ogg")], "images/mixer/thumbs/fish_blue_LONG.jpg", 370),

				new VidClip([new VidSource("images/mixer/240p/winter_icicle_drip_LOOP.mp4", "video/mp4"), 
							new VidSource("images/mixer/240p/winter_icicle_drip_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/winter_icicle_drip_LOOP.jpg", 370),
				
				new VidClip([new VidSource("images/mixer/240p/fish_tiny_LONG.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_tiny_LONG.ogg", "video/ogg")], "images/mixer/thumbs/fish_tiny_LONG.jpg", 370),
				new VidClip([new VidSource("images/mixer/240p/fish_tropical_VERT_LOOP.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_tropical_VERT_LOOP.ogg", "video/ogg")], "images/mixer/thumbs/fish_tropical_VERT_LOOP.jpg", 370),
				new VidClip([new VidSource("images/mixer/240p/fish_water_reflections.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/fish_water_reflections.ogg", "video/ogg")], "images/mixer/thumbs/fish_water_reflections.jpg", 370),
	
	/*			new VidClip([new VidSource("images/mixer/240p/union_square640x480.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/union_square640x480.ogg", "video/ogg")], "images/mixer/thumbs/union_square640x480.jpg"),
	*/
		
				new VidClip([new VidSource("images/mixer/240p/driving_night_streaks.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/driving_night_streaks.ogg", "video/ogg")], "images/mixer/thumbs/driving_night_streaks.jpg", 500),
				new VidClip([new VidSource("images/mixer/240p/union_square_tilt_shift.mp4", "video/mp4"), 
					new VidSource("images/mixer/240p/union_square_tilt_shift.ogg", "video/ogg")], "images/mixer/thumbs/union_square_tilt_shift.jpg", 500),
				new VidClip("images/mixer/bermuda_eyehole.png", "images/mixer/thumbs/bermuda_eyehole.jpg", 500),
			
				//gif jockey

new VidClip('images/mixer/gif_sorted/_loopy/atom_b.gif', 'images/mixer/gif_sorted/_loopy/thumb/atom_b.jpg',600),
new VidClip('images/mixer/gif_sorted/_loopy/ballonface.gif', 'images/mixer/gif_sorted/_loopy/thumb/ballonface.jpg'),
new VidClip('images/mixer/gif_sorted/_loopy/Dominoes.gif', 'images/mixer/gif_sorted/_loopy/thumb/Dominoes.jpg'),
new VidClip('images/mixer/gif_sorted/_loopy/glacier.gif', 'images/mixer/gif_sorted/_loopy/thumb/glacier.jpg',700),
new VidClip('images/mixer/gif_sorted/_loopy/golf_ball.gif', 'images/mixer/gif_sorted/_loopy/thumb/golf_ball.jpg',800),
new VidClip('images/mixer/gif_sorted/_loopy/light_blub_vs_mousetrap.gif', 'images/mixer/gif_sorted/_loopy/thumb/light_blub_vs_mousetrap.jpg'),
new VidClip('images/mixer/gif_sorted/_loopy/subway_14th_st_loop.gif', 'images/mixer/gif_sorted/_loopy/thumb/subway_14th_st_loop.jpg',500),
new VidClip('images/mixer/gif_sorted/_loopy/subway_endless.gif', 'images/mixer/gif_sorted/_loopy/thumb/subway_endless.jpg',300),
new VidClip('images/mixer/gif_sorted/_loopy/swimming.gif', 'images/mixer/gif_sorted/_loopy/thumb/swimming.jpg',300),

new VidClip('images/mixer/gif_sorted/_bright/bb-v-bubble.gif', 'images/mixer/gif_sorted/_bright/thumb/bb-v-bubble.jpg',500),
new VidClip('images/mixer/gif_sorted/_bright/break_glass.gif', 'images/mixer/gif_sorted/_bright/thumb/break_glass.jpg', 400),
new VidClip('images/mixer/gif_sorted/_bright/dancing.gif', 'images/mixer/gif_sorted/_bright/thumb/dancing.jpg',700),
new VidClip('images/mixer/gif_sorted/_bright/eat_yourself.gif', 'images/mixer/gif_sorted/_bright/thumb/eat_yourself.jpg', 300),
new VidClip('images/mixer/gif_sorted/_bright/jupiter-Voyager_58M_to_31M_reduced.gif', 'images/mixer/gif_sorted/_bright/thumb/jupiter-Voyager_58M_to_31M_reduced.jpg'),
new VidClip('images/mixer/gif_sorted/_bright/lightning.gif', 'images/mixer/gif_sorted/_bright/thumb/lightning.jpg'),
new VidClip('images/mixer/gif_sorted/_bright/us_takeover.gif', 'images/mixer/gif_sorted/_bright/thumb/us_takeover.jpg', 400),
new VidClip('images/mixer/gif_sorted/_bright/walkin1.gif', 'images/mixer/gif_sorted/_bright/thumb/walkin1.jpg'),
new VidClip('images/mixer/gif_sorted/_bright/x-ray_drinking.gif', 'images/mixer/gif_sorted/_bright/thumb/x-ray_drinking.jpg',600),

new VidClip('images/mixer/gif_sorted/_dark/artichoke.gif', 'images/mixer/gif_sorted/_dark/thumb/artichoke.jpg'),
new VidClip('images/mixer/gif_sorted/_dark/eat.gif', 'images/mixer/gif_sorted/_dark/thumb/eat.jpg'),
new VidClip('images/mixer/gif_sorted/_dark/eyeball.gif', 'images/mixer/gif_sorted/_dark/thumb/eyeball.jpg',400),
new VidClip('images/mixer/gif_sorted/_dark/fire_swords.gif', 'images/mixer/gif_sorted/_dark/thumb/fire_swords.jpg',700),
new VidClip('images/mixer/gif_sorted/_dark/headscan.gif', 'images/mixer/gif_sorted/_dark/thumb/headscan.jpg',800),
new VidClip('images/mixer/gif_sorted/_dark/pineapple-mri.gif', 'images/mixer/gif_sorted/_dark/thumb/pineapple-mri.jpg',800),
new VidClip('images/mixer/gif_sorted/_dark/Popcorn_decepticon.gif', 'images/mixer/gif_sorted/_dark/thumb/Popcorn_decepticon.jpg'),
new VidClip('images/mixer/gif_sorted/_dark/stream_of_dots.gif', 'images/mixer/gif_sorted/_dark/thumb/stream_of_dots.jpg', 500),
new VidClip('images/mixer/gif_sorted/_dark/xray_body-mri.gif', 'images/mixer/gif_sorted/_dark/thumb/xray_body-mri.jpg',700),


new VidClip('images/mixer/gif_sorted/_pixel/can-i-helllp-yazxmcn.gif', 'images/mixer/gif_sorted/_pixel/thumb/can-i-helllp-yazxmcn.jpg', 200),
new VidClip('images/mixer/gif_sorted/_pixel/cardioid_fractal.gif', 'images/mixer/gif_sorted/_pixel/thumb/cardioid_fractal.jpg'),
new VidClip('images/mixer/gif_sorted/_pixel/cubes.gif', 'images/mixer/gif_sorted/_pixel/thumb/cubes.jpg',600),
new VidClip('images/mixer/gif_sorted/_pixel/glitchy.gif', 'images/mixer/gif_sorted/_pixel/thumb/glitchy.jpg',300),
new VidClip('images/mixer/gif_sorted/_pixel/hmuon.gif', 'images/mixer/gif_sorted/_pixel/thumb/hmuon.jpg', 200),
new VidClip('images/mixer/gif_sorted/_pixel/stars_sideways.gif', 'images/mixer/gif_sorted/_pixel/thumb/stars_sideways.jpg',700),
new VidClip('images/mixer/gif_sorted/_pixel/Swglj.gif', 'images/mixer/gif_sorted/_pixel/thumb/Swglj.jpg', 500),


new VidClip('images/mixer/gif_sorted/_trippy/aurora.gif', 'images/mixer/gif_sorted/_trippy/thumb/aurora.jpg', 400),
new VidClip('images/mixer/gif_sorted/_trippy/eyemazing.gif', 'images/mixer/gif_sorted/_trippy/thumb/eyemazing.jpg', 100),
new VidClip('images/mixer/gif_sorted/_trippy/eyemazing_color.gif', 'images/mixer/gif_sorted/_trippy/thumb/eyemazing_color.jpg'),
new VidClip('images/mixer/gif_sorted/_trippy/piccaso.gif', 'images/mixer/gif_sorted/_trippy/thumb/piccaso.jpg', 100),
new VidClip('images/mixer/gif_sorted/_trippy/reddit_on_acid.gif', 'images/mixer/gif_sorted/_trippy/thumb/reddit_on_acid.jpg'),
new VidClip('images/mixer/gif_sorted/_trippy/torus_of_arms.gif', 'images/mixer/gif_sorted/_trippy/thumb/torus_of_arms.jpg'),
new VidClip('images/mixer/gif_sorted/_trippy/tripler.gif', 'images/mixer/gif_sorted/_trippy/thumb/tripler.jpg'),
new VidClip('images/mixer/gif_sorted/_trippy/tumblrlbfo7jbvr91qzpwi0.gif', 'images/mixer/gif_sorted/_trippy/thumb/tumblrlbfo7jbvr91qzpwi0.jpg', 400),
new VidClip('images/mixer/gif_sorted/_trippy/van-gogh-3d.gif', 'images/mixer/gif_sorted/_trippy/thumb/van-gogh-3d.jpg', 100),
new VidClip('images/mixer/gif_sorted/_trippy/van_gogh-swirly_night.gif', 'images/mixer/gif_sorted/_trippy/thumb/van_gogh-swirly_night.jpg', 200),

new VidClip('images/mixer/gif_sorted/_funny/bill_cosby-jello.gif', 'images/mixer/gif_sorted/_funny/thumb/bill_cosby-jello.jpg'),
new VidClip('images/mixer/gif_sorted/_funny/elmo_toilet_dance.gif', 'images/mixer/gif_sorted/_funny/thumb/elmo_toilet_dance.jpg', 200),
new VidClip('images/mixer/gif_sorted/_funny/laser_situation.gif', 'images/mixer/gif_sorted/_funny/thumb/laser_situation.jpg', 200),
new VidClip('images/mixer/gif_sorted/_funny/merlin_smoking_pipe.gif', 'images/mixer/gif_sorted/_funny/thumb/merlin_smoking_pipe.jpg', 100),
new VidClip('images/mixer/gif_sorted/_funny/neti.gif', 'images/mixer/gif_sorted/_funny/thumb/neti.jpg', 100),
new VidClip('images/mixer/gif_sorted/_funny/rainbow.gif', 'images/mixer/gif_sorted/_funny/thumb/rainbow.jpg', 500),
new VidClip('images/mixer/gif_sorted/_funny/transformer_man_to_car.gif', 'images/mixer/gif_sorted/_funny/thumb/transformer_man_to_car.jpg', 100),


new VidClip('images/mixer/gif_sorted/dvdp/circuits-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/circuits-dvdp.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/colorplosion-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/colorplosion-dvdp.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/colors_oscillating-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/colors_oscillating-dvdp.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/cubes_pulsing_sphere.gif', 'images/mixer/gif_sorted/dvdp/thumb/cubes_pulsing_sphere.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/cubes_rotate-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/cubes_rotate-dvdp.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/egg_colors-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/egg_colors-dvdp.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/flying_through_bubbles.gif', 'images/mixer/gif_sorted/dvdp/thumb/flying_through_bubbles.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/hexagons.gif', 'images/mixer/gif_sorted/dvdp/thumb/hexagons.jpg'),
new VidClip('images/mixer/gif_sorted/dvdp/hyperblog.gif', 'images/mixer/gif_sorted/dvdp/thumb/hyperblog.jpg', 500),
new VidClip('images/mixer/gif_sorted/dvdp/seizure_sun.gif', 'images/mixer/gif_sorted/dvdp/thumb/seizure_sun.jpg', 500),
new VidClip('images/mixer/gif_sorted/dvdp/shifting_lines-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/shifting_lines-dvdp.jpg', 400),
new VidClip('images/mixer/gif_sorted/dvdp/shifting_lines2-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/shifting_lines2-dvdp.jpg', 300),
new VidClip('images/mixer/gif_sorted/dvdp/shifting_smoke-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/shifting_smoke-dvdp.jpg', 500),
new VidClip('images/mixer/gif_sorted/dvdp/torus_infinite-dvdp.gif', 'images/mixer/gif_sorted/dvdp/thumb/torus_infinite-dvdp.jpg', 200),
new VidClip('images/mixer/gif_sorted/dvdp/tree_trunk.gif', 'images/mixer/gif_sorted/dvdp/thumb/tree_trunk.jpg', 700),
new VidClip('images/mixer/gif_sorted/dvdp/triangle_sea.gif', 'images/mixer/gif_sorted/dvdp/thumb/triangle_sea.jpg', 500),
new VidClip('images/mixer/gif_sorted/dvdp/wavy_hat.gif', 'images/mixer/gif_sorted/dvdp/thumb/wavy_hat.jpg', 300),

new VidClip('images/mixer/gif_sorted/pixelfucks/bear_dancing.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/bear_dancing.jpg', 400),
new VidClip('images/mixer/gif_sorted/pixelfucks/bend_it.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/bend_it.jpg', 450),
new VidClip('images/mixer/gif_sorted/pixelfucks/BUZZED_UP.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/BUZZED_UP.jpg', 400),
new VidClip('images/mixer/gif_sorted/pixelfucks/cat_tripping.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/cat_tripping.jpg', 500),
new VidClip('images/mixer/gif_sorted/pixelfucks/infinite_walk.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/infinite_walk.jpg', 400),
new VidClip('images/mixer/gif_sorted/pixelfucks/miss_miss.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/miss_miss.jpg', 700),
new VidClip('images/mixer/gif_sorted/pixelfucks/OLD_NESS.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/OLD_NESS.jpg', 200),
new VidClip('images/mixer/gif_sorted/pixelfucks/piano_kd.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/piano_kd.jpg', 400),
new VidClip('images/mixer/gif_sorted/pixelfucks/PSYCHEDELIC_HORSE.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/PSYCHEDELIC_HORSE.jpg', 600),
new VidClip('images/mixer/gif_sorted/pixelfucks/rainbow_legs.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/rainbow_legs.jpg', 400),
new VidClip('images/mixer/gif_sorted/pixelfucks/SKELEPTIN.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/SKELEPTIN.jpg', 500),
new VidClip('images/mixer/gif_sorted/pixelfucks/star_child.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/star_child.jpg', 500),
new VidClip('images/mixer/gif_sorted/pixelfucks/swingin_hamster.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/swingin_hamster.jpg', 200),
new VidClip('images/mixer/gif_sorted/pixelfucks/torf.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/torf.jpg', 200),
new VidClip('images/mixer/gif_sorted/pixelfucks/turtle_turntable.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/turtle_turntable.jpg', 200),
new VidClip('images/mixer/gif_sorted/pixelfucks/ultimate_warrior.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/ultimate_warrior.jpg', 300),
new VidClip('images/mixer/gif_sorted/pixelfucks/unnesssarrry.gif', 'images/mixer/gif_sorted/pixelfucks/thumb/unnesssarrry.jpg', 200),


new VidClip('images/mixer/gif_sorted/Francoise_Gamma/01___MYSTIC_arrugarseFLs.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/01___MYSTIC_arrugarseFLs.jpg', 400),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/02___FLY___again.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/02___FLY___again.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/03___METAPHYSICAL___variacion.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/03___METAPHYSICAL___variacion.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/05___DANCE_luz.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/05___DANCE_luz.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/09___xelims___.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/09___xelims___.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/ESCULTURA__movimentFLA__02.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/ESCULTURA__movimentFLA__02.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/fractura.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/fractura.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/fracturas.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/fracturas.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/JUMPJUMPJUMP_Symetry.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/JUMPJUMPJUMP_Symetry.jpg', 450),
new VidClip('images/mixer/gif_sorted/Francoise_Gamma/walking_wireframe-Untitled_Outside_003b.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/walking_wireframe-Untitled_Outside_003b.jpg', 450),
//new VidClip('images/mixer/gif_sorted/Francoise_Gamma/walking_wireframe.gif', 'images/mixer/gif_sorted/Francoise_Gamma/thumb/walking_wireframe.jpg', 450),

new VidClip('images/mixer/gif_sorted/Icky/adam_harms.gif', 'images/mixer/gif_sorted/Icky/thumb/adam_harms.jpg'),
new VidClip('images/mixer/gif_sorted/Icky/doggy_dog_world-lcky.gif', 'images/mixer/gif_sorted/Icky/thumb/doggy_dog_world-lcky.jpg', 400),

new VidClip('images/mixer/gif_sorted/surrogate_self/34LNS-TUNNEL.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/34LNS-TUNNEL.jpg', 330),
new VidClip('images/mixer/gif_sorted/surrogate_self/bllz.KLSTR.bw.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/bllz.KLSTR.bw.jpg', 330),
new VidClip('images/mixer/gif_sorted/surrogate_self/bllzKLSTR.Anim.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/bllzKLSTR.Anim.jpg', 630),
new VidClip('images/mixer/gif_sorted/surrogate_self/BlokSTAK.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/BlokSTAK.jpg', 500),
new VidClip('images/mixer/gif_sorted/surrogate_self/brk_thru.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/brk_thru.jpg', 400),
new VidClip('images/mixer/gif_sorted/surrogate_self/FluidHORIZON.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/FluidHORIZON.jpg', 330),
new VidClip('images/mixer/gif_sorted/surrogate_self/grid_konstrukt.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/grid_konstrukt.jpg', 500),
new VidClip('images/mixer/gif_sorted/surrogate_self/hyper_xtrusion.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/hyper_xtrusion.jpg', 330),
new VidClip('images/mixer/gif_sorted/surrogate_self/iGlooXPLD.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/iGlooXPLD.jpg', 730),
new VidClip('images/mixer/gif_sorted/surrogate_self/mushrooms.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/mushrooms.jpg', 330),
new VidClip('images/mixer/gif_sorted/surrogate_self/platonik_in_cube.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/platonik_in_cube.jpg', 530),
new VidClip('images/mixer/gif_sorted/surrogate_self/PLN.Rise.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/PLN.Rise.jpg', 200),
new VidClip('images/mixer/gif_sorted/surrogate_self/RECYCLE.BOX.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/RECYCLE.BOX.jpg', 130),
new VidClip('images/mixer/gif_sorted/surrogate_self/RingsXperiment.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/RingsXperiment.jpg', 530),
new VidClip('images/mixer/gif_sorted/surrogate_self/ringz.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/ringz.jpg', 430),
new VidClip('images/mixer/gif_sorted/surrogate_self/Toruz_KONSTRKT.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/Toruz_KONSTRKT.jpg', 730),
new VidClip('images/mixer/gif_sorted/surrogate_self/trippyometry.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/trippyometry.jpg', 630),
new VidClip('images/mixer/gif_sorted/surrogate_self/Tube.DSTRKT .gif', 'images/mixer/gif_sorted/surrogate_self/thumb/Tube.DSTRKT .jpg', 330),
new VidClip('images/mixer/gif_sorted/surrogate_self/Untitled-015.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/Untitled-015.jpg', 530),
new VidClip('images/mixer/gif_sorted/surrogate_self/Untitled-018.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/Untitled-018.jpg', 730),
new VidClip('images/mixer/gif_sorted/surrogate_self/Untitled-020.gif', 'images/mixer/gif_sorted/surrogate_self/thumb/Untitled-020.jpg', 630),


new VidClip('images/mixer/gif_sorted/_wtf/anatomy.gif', 'images/mixer/gif_sorted/_wtf/thumb/anatomy.jpg', 260),
new VidClip('images/mixer/gif_sorted/_wtf/break_dancing.gif', 'images/mixer/gif_sorted/_wtf/thumb/break_dancing.jpg', 260),
new VidClip('images/mixer/gif_sorted/_wtf/deer_life.gif', 'images/mixer/gif_sorted/_wtf/thumb/deer_life.jpg', 260),
new VidClip('images/mixer/gif_sorted/_wtf/dogfighter.gif', 'images/mixer/gif_sorted/_wtf/thumb/dogfighter.jpg', 560),
new VidClip('images/mixer/gif_sorted/_wtf/Exploding-head.gif', 'images/mixer/gif_sorted/_wtf/thumb/Exploding-head.jpg', 660),
new VidClip('images/mixer/gif_sorted/_wtf/exploding_runner.gif', 'images/mixer/gif_sorted/_wtf/thumb/exploding_runner.jpg', 260),
new VidClip('images/mixer/gif_sorted/_wtf/eyes.gif', 'images/mixer/gif_sorted/_wtf/thumb/eyes.jpg', 1000),
new VidClip('images/mixer/gif_sorted/_wtf/full_body_workout.gif', 'images/mixer/gif_sorted/_wtf/thumb/full_body_workout.jpg', 460),
new VidClip('images/mixer/gif_sorted/_wtf/hoop_girl.gif', 'images/mixer/gif_sorted/_wtf/thumb/hoop_girl.jpg', 450),
new VidClip('images/mixer/gif_sorted/_wtf/infinite_zoom.gif', 'images/mixer/gif_sorted/_wtf/thumb/infinite_zoom.jpg', 460),
new VidClip('images/mixer/gif_sorted/_wtf/keyboard_zap.gif', 'images/mixer/gif_sorted/_wtf/thumb/keyboard_zap.jpg', 560),
new VidClip('images/mixer/gif_sorted/_wtf/licklol.gif', 'images/mixer/gif_sorted/_wtf/thumb/licklol.jpg', 860),
new VidClip('images/mixer/gif_sorted/_wtf/papers_flying.gif', 'images/mixer/gif_sorted/_wtf/thumb/papers_flying.jpg', 160),
new VidClip('images/mixer/gif_sorted/_wtf/reindeer-activate.gif', 'images/mixer/gif_sorted/_wtf/thumb/reindeer-activate.jpg', 360),
new VidClip('images/mixer/gif_sorted/_wtf/seahorse_birthing.gif', 'images/mixer/gif_sorted/_wtf/thumb/seahorse_birthing.jpg', 260),
new VidClip('images/mixer/gif_sorted/_wtf/soccer_deadly.gif', 'images/mixer/gif_sorted/_wtf/thumb/soccer_deadly.jpg', 100),
new VidClip('images/mixer/gif_sorted/_wtf/spin_hat_loop.gif', 'images/mixer/gif_sorted/_wtf/thumb/spin_hat_loop.jpg', 260),


new VidClip('images/mixer/gif_sorted/_animals/buffalo.gif', 'images/mixer/gif_sorted/_animals/thumb/buffalo.jpg'),
new VidClip('images/mixer/gif_sorted/_animals/cat-slide.gif', 'images/mixer/gif_sorted/_animals/thumb/cat-slide.jpg', 250),
new VidClip('images/mixer/gif_sorted/_animals/cat_bongos.gif', 'images/mixer/gif_sorted/_animals/thumb/cat_bongos.jpg', 250),
new VidClip('images/mixer/gif_sorted/_animals/cat_spin.gif', 'images/mixer/gif_sorted/_animals/thumb/cat_spin.jpg', 250),
new VidClip('images/mixer/gif_sorted/_animals/cat_twitchy.gif', 'images/mixer/gif_sorted/_animals/thumb/cat_twitchy.jpg', 250),
new VidClip('images/mixer/gif_sorted/_animals/fisheat.gif', 'images/mixer/gif_sorted/_animals/thumb/fisheat.jpg', 450),
new VidClip('images/mixer/gif_sorted/_animals/man_rides_WTF.gif', 'images/mixer/gif_sorted/_animals/thumb/man_rides_WTF.jpg', 850),

/*

new VidClip('images/mixer/gif_sorted/_pop/chewin_gum.gif', 'images/mixer/gif_sorted/_pop/thumb/chewin_gum.jpg'),
new VidClip('images/mixer/gif_sorted/_pop/clarissa_explains_it_all.gif', 'images/mixer/gif_sorted/_pop/thumb/clarissa_explains_it_all.jpg'),
new VidClip('images/mixer/gif_sorted/_pop/mind_blown.gif', 'images/mixer/gif_sorted/_pop/thumb/mind_blown.jpg'),
new VidClip('images/mixer/gif_sorted/_pop/zoidberg.gif', 'images/mixer/gif_sorted/_pop/thumb/zoidberg.jpg'),

*/


				]); //copy array and add more!
	
	
	  
   
   	
	
			var lsd = $().takeLSD(vidClips, compositeTypes, null, userId);				

			$().musicPlayer('/sounds/odbol%20-%20Between%20a%20Shock%20and%20a%20Charred%20Face.mp3', lsd);
		});
	</script>	
	
	
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-32858585-1']);
  _gaq.push(['_setDomainName', 'odbol.com']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();

</script>
</body>
</html>
