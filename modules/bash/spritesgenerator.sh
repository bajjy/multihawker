#!/bin/bash

# ver. 0.0.2
echo -e "Multihawker sprite generator create folder called \"sprites\" horizontal combined frames"

if [ "$1" == "" ] || [ "$2" == "" ]; then
    echo -e "Argument missing. Use:"
    echo -e "./spritegenerator.sh [./folder_or_file/to/convert] [./folder/to/put/converted_files]"
    exit 200
fi

folder=$1
output=$2

mkdir -p $output;
mkdir -p $output/sprites;

function folderProcessor {
    #$1 = resolution $2 = quality
    for video in $folder/*.*; 
    do 
        fullfile=$video
        fname=$(basename $fullfile)
        fbname=${fname%.*}
        fps=$(ffmpeg -i $video 2>&1 | sed -n "s/.*, \(.*\) fp.*/\1/p")
        echo $video $fps

        #ffmpeg -i "$video"  -hide_banner -loglevel quiet $output/$(basename "${video/.*}").mp4 
        #-i input -an noaudio -vcodec video codec -pix_fmt pixel format (will not play without in some old shit) 
        ffmpeg \
        -i $video \
        -r $fps \
        $output/$fbname-%04d.png \
        -hide_banner 
        echo $output/$fbname-@.mp4
        convert $output/$fbname* +append $output/sprites/$fbname-sprite.png
    done
}

function fileProcessor {
    #$1 = resolution $2 = quality
    video=$folder
    fullfile=$video
    fname=$(basename $fullfile)
    fbname=${fname%.*}
    fps=$(ffmpeg -i $video 2>&1 | sed -n "s/.*, \(.*\) fp.*/\1/p")
    echo $video

    #ffmpeg -i "$video"  -hide_banner -loglevel quiet $output/$(basename "${video/.:}").mp4 
    #-i input -an noaudio -vcodec video codec -pix_fmt pixel format (will not play without in some old shit) 
    ffmpeg \
    -i $video \
    -r $fps \
    $output/$fbname-%04d.png \
    -hide_banner 
    echo $output/$fbname-@.mp4
    convert $output/$fbname* +append $output/sprites/$fbname-sprite.png
}


if [ ! -f $folder ];
then
    echo "folderProcessor"
    folderProcessor
else
    echo "fileProcessor"
    fileProcessor
fi
