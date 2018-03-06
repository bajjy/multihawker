#!/bin/bash

# ver. 0.0.2
multihawker=$0
project=$PWD


cd $(dirname $0)
if [ "$1" == "" ]; then
    if [ ! -f $project/multihawker.js ]; then
        echo "multihawker.js not found in project folder!"
        exit 1
    fi
    npm run start -- -p $project $@
    exit 0
fi
npm run start -- $project $@