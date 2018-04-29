#!/bin/bash

# ver. 0.0.2
echo -e "Multihawker mp4 to web video converter. ver 0.0.2"

if [ "$1" == "" ] || [ "$2" == "" ]; then
    echo -e "Argument missing. Use:"
    echo -e "./videofolder.sh [./folder_or_file/to/convert] [./folder/to/put/converted_files]"
    exit 200
fi

folder=$1
output=$2
resolution=("1920" "1280" "1024")
quality=("5000k" "2500k" "180k")

mkdir -p $output;

function folderProcessor {
    #$1 = resolution $2 = quality
    for video in $folder/*.*; 
    do 
        fullfile=$video
        fname=$(basename $fullfile)
        fbname=${fname%.*}

        echo $video
        echo "processing: $1 $2"
        #ffmpeg -i "$video"  -hide_banner -loglevel quiet $output/$(basename "${video/.*}").mp4 
        #-i input -an noaudio -vcodec video codec -pix_fmt pixel format (will not play without in some old shit) 
        ffmpeg \
        -i $video \
        -vf scale=$1:-1 \
        -b:v $2 \
        -vcodec libx264 \
        -pix_fmt yuv420p \
        -an \
        -hide_banner \
        $output/$fbname-$1.mp4
        echo $output/$fbname-$1.mp4
        sleep 1

        ffmpeg \
        -i $video \
        -vf scale=$1:-1 \
        -b:v $2 \
        -vcodec libvpx-vp9 \
        -pix_fmt yuv420p \
        -an \
        -hide_banner \
        $output/$fbname-$1.webm
        echo $output/$fbname-$1.webm
        sleep 1
    done
}

function fileProcessor {
    #$1 = resolution $2 = quality
    video=$folder
    fullfile=$video
    fname=$(basename $fullfile)
    fbname=${fname%.*}

    echo $video
    echo "processing: $1 $2"
    #ffmpeg -i "$video"  -hide_banner -loglevel quiet $output/$(basename "${video/.:}").mp4 
    #-i input -an noaudio -vcodec video codec -pix_fmt pixel format (will not play without in some old shit) 
    ffmpeg \
    -i $video \
    -vf scale=$1:-1 \
    -b:v $2 \
    -vcodec libx264 \
    -pix_fmt yuv420p \
    -an \
    -hide_banner \
    $output/$fbname-$1.mp4
    echo $output/$fbname-$1.mp4
    sleep 1

    ffmpeg \
    -i $video \
    -vf scale=$1:-1 \
    -b:v $2 \
    -vcodec libvpx-vp9 \
    -pix_fmt yuv420p \
    -an \
    -hide_banner \
    $output/$fbname-$1.webm
    echo $output/$fbname-$1.webm
    sleep 1
}

for index in ${!resolution[*]}
do
    if [ ! -f $folder ];
    then
        echo "folderProcessor"
        folderProcessor ${resolution[$index]} ${quality[$index]}
    else
        echo "fileProcessor"
        fileProcessor ${resolution[$index]} ${quality[$index]}
    fi
done
#ffmpegProcessor $arg1 $arg2
#find $folder -type f -name ::.:: -exec ffmpeg -i {} -c copy -codec libx264 ${output}`:$(basename {} wav):` \;
#ffmpeg -i out.flv -map 0 -c copy -c:v:1 libx264 -c:a:137 libvorbis out.flv