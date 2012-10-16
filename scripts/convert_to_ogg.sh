#!/bin/bash


for f in $@
do
  echo "Converting $f to ogg..."
  # take action on each file. $f store current file name
  ffmpeg -i $f -vcodec libtheora -an $f.ogv

  echo "Converting $f to gif..."
  #ffmpeg -i $f -pix_fmt rgb24 $f.gif
done