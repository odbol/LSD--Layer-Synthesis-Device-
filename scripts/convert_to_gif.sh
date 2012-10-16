#!/bin/bash

#for gifs:
FILES=$1
for f in $@
do
  echo "Converting $f to mp4..."
  mkdir tmp
  ffmpeg -i $f -pix_fmt rgb24 -t 10 "tmp/out%d.jpg"

  gifsicle --delay=10 --loop tmp/*.gif > $f.gif

  #rm -Rf tmp
done