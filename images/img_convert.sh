magick $1 -resize 241 pf_$1
magick pf_$1 -crop 241x294+0+0 $1
rm pf_$1
