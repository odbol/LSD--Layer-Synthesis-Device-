#!/bin/bash

# requires:
#   ffmpeg
#   gifsicle
#   imagemagick


#for gifs:
outdir="_gifs_to_mov/" #$2
for f in $@
do
  outname=$outdir$f.mov

  mkdir tmp

  mkdir -p $(dirname "$outname")

  #get framerate of gif
  framedelay=`gifsicle -I $f| sed -n "s/.*delay \([^s]*\).*/\1/p" | head -n1`
  framerate=`echo "1 / $framedelay" | bc`

  echo "Converting $f to mjpeg at $framerate fps: $outname"

  #convert gif to avi
  convert -coalesce $f tmp/out%05d.jpg
  ffmpeg -r $framerate -i tmp/out%05d.jpg -vcodec mjpeg -y -an $outname

  # this is supposed to center the image, but -coalesce works better:
  # -vf pad="3/2*iw:3/2*ih:(ow-iw)/2:(oh-ih)/2"

  #fun filters to try: 
  # hue="H=2*PI*t: s=sin(2*PI*t)+1"
  # edgedetect=low=0.1:high=0.4

  rm -Rf tmp
done