#!/bin/bash

# ver. 0.0.1
MARKDOWN=$1
echo $MARKDOWN | pandoc -f markdown -t html