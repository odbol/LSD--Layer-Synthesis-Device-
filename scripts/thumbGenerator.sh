#!/bin/tcsh

set dest = $1

foreach f (./*)
	if (-d $f) then
		mkdir "$f"/thumb
		python ./thumbGenerator.py "$f" 
	endif
end

