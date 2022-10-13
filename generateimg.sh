#!/bin/bash
while getopts 'i:o:d:g:' c
do
  case $c in
    i) LOGOID=$OPTARG ;;
    o) OUTPUTFILE=$OPTARG ;;
    d) DIRECTION=$OPTARG ;;
    g) GRADIENT=$OPTARG ;;
  esac
done


LOGOSTOR="https://dnbwg2.oss-cn-hongkong.aliyuncs.com/nft/logo-collection/"
LOGOFILE=/tmp/$LOGOID.lgo
INPUTFILE=/tmp/$LOGOID.png

rm -f $LOGOFILE
wget $LOGOSTOR$LOGOID.lgo -P /tmp/ || exit 1
npx jslogo -f $LOGOFILE -o /tmp/$LOGOID
#get logo generated image size
SIZE=`gm identify -format %wx%h $INPUTFILE`
echo $SIZE

#generate gradient match size
gm convert -size $SIZE  -define gradient:direction=$DIRECTION  gradient:$GRADIENT  /tmp/gradient.jpg

#reduce color to forground and background(white)
gm convert -colors 2  $INPUTFILE /tmp/stage1.png

#purify white background and make the background transparent
gm convert -operator All Threshold-White 90% /tmp/stage1.png /tmp/stage2.png
gm convert -matte -fill transparent -opaque white  /tmp/stage2.png /tmp/stage3.png

#combine background gradient
gm composite -quality 100 /tmp/stage3.png /tmp/gradient.jpg $OUTPUTFILE
