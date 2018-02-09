#!/bin/bash

folder=$1
output=$2
find ${folder} -name "*.png" -print0 -exec pngquant --force --skip-if-larger --quality=80-95 --ext .png {} \;
rsync -rvhPt ${folder} ${output} --out-format=%n