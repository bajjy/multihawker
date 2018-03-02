#!/bin/bash

# ver. 0.0.1

if [ "$1" == "" ]; then
    echo -e "Argument missing. Use:"
    echo -e "./watcher.sh [./folder_to_watch] [(optional)./folder/to/exclude]"
    exit 200
fi

folder=$1
exclude=$2

if [ -z "$2" ];
then
inotifywait -r ${folder};
else 
inotifywait -r ${folder} --exclude ${exclude};
fi
