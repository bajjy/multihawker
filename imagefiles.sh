#!/bin/bash

count=1
while [ -n "${1}" ]
do
#echo "Parameter #$count = ${1}"
cp ${1} ${1}_1.
count=$(( $count + 1 ))
shift
done