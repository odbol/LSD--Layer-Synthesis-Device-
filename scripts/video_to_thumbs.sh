#make with mpeg streamclip, then:

mkdir first
cp *" 1.jpg" first/
python ~/scripts/batch_rename.py " 1" "" first/
python ~/scripts/batch_rename.py "#" "-" first/



#make thumbnail

ffmpeg  -itsoffset -1 -i $1 -vcodec mjpeg -vframes 1 -an -f rawvideo -s 320x240 $1

 
#make gif
#Convert .avi to animated gif(uncompressed)

#ffmpeg -i video_origine.avi gif_anime.gif

#ffmpeg.exe -y -i RawVideo.avi -pix_fmt rgb24 -f gif -an -r 24 -ss 10 -t 3 -loop_output 0 VideoAnimation.gif





#./mplayer /Volumes/LaCie/Movies/Battlehooch\ -\ Joke\ -\ Timelapse/_trimmed/full/Battlehooch-Joke-Grant3 -ao null -vo jpeg -frames 1