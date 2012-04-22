#python thumbGenerator.py /Volumes/EIN/Pictures/VJ_fodder/

from PIL import Image, ImageDraw, ImageFont
from math import atan, degrees
import os
import os.path
import shutil
import sys



FONT = "/Library/Fonts/Chalkboard.ttf"

THUMB_WIDTH = 45
THUMB_HEIGHT = 45
LARGE_WIDTH = 500
LARGE_HEIGHT = 400
PADDING = 3


directory = './images/mixer/gif/'
if len(sys.argv) > 1:
	directory = sys.argv[1]

#change to >= 0 to name files sequentially starting from that hundred
numberFrom = -1

rotationAngle = 0#-90




###############################


#open each file and split into a matrix of files
i = 1
for f in  os.listdir(directory):
	filename = os.path.join(directory, f)
	
	if not filename.lower().endswith(".gif") or filename.lower().find("/.") > 0:
		continue
	
	if numberFrom >= 0:
		fileNum = "vp%d%02d" % (numberFrom, i)
		f = fileNum + ".jpg"
	else:
		fileNum = f.rsplit(".", 1)[0] + ".jpg"
	f = fileNum
	
	print "Processing %s (%s)" % (filename, fileNum)
	
	full = Image.open(filename).convert("RGB")
	if rotationAngle != 0:
		full = full.rotate(rotationAngle)
		print "Rotating %d degrees" % rotationAngle
	
	thumb = full.copy()
	thumb.thumbnail((THUMB_WIDTH, THUMB_HEIGHT), Image.ANTIALIAS)
	thumb.save(os.path.join(directory, "thumb/", f), quality=50, optimize=True)


	i += 1

