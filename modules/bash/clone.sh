 #!/bin/bash

# ver. 0.0.1

if [ "$1" == "" ] || [ $2 == "" ]; then
    echo "Argument missing. Usage:"
    echo "./clone.sh [./folder_to] [file1 file2 ./file3 ... fileN]"
    exit 1
fi

to="$1"
shift
cp -R -t $to $@