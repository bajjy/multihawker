#!/bin/bash

# ver. 0.0.2
multihawker=$0
project=$PWD

if [ ! -f $project/multihawker.js ]; then
    echo "multihawker.js not found in project folder!"
    exit 1
fi
cd $(dirname $0)
npm run start -- -p $project $@