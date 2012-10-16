#!/bin/bash

#for gifs:
FILES=$1
for f in $1
do
  echo "Converting $f to mp4..."
  mkdir tmp
  ffmpeg -i $f -t 10 "tmp/out%d.gif"

  gifsicle --delay=10 --loop tmp/*.gif > $f.gif

  rm -Rf tmp
done