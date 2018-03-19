#!/bin/bash

# ver. 0.0.2

if [ "$1" == "" ]; then
    echo -e "Argument missing. Use:"
    echo -e "./imagefolder.sh [./folder_to_convert] [(optional)./folder/to/sync]"
    exit 200
fi

folder=$1
output=$2
find ${folder} -name "*.png" -print0 -exec pngquant --force --skip-if-larger --quality=50-95 --ext .png {} \;
rsync -rvhPt ${folder} ${output} --out-format=%n --delete