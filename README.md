![screenshot](https://photos-5.dropbox.com/t/2/AACu7gDIgdqRf4wl6P-8rqs8POppdnmpfnUkEjyLizeKaA/12/2191409/png/32x32/1/_/1/2/multihawker.png/EIv5gGoYAiACKAI/RtMyBj9eUYJoufsRMd02IBs65o8IL68UU-olO62qaTo?preserve_transparency=1&size=2048x1536&size_mode=3)

Multihawker is simple DIY build system created with [ecmascript 6](http://www.ecma-international.org/ecma-262/6.0/). The goal of this project is to get rid of a trillion of forein packages, tools and libraries from questionable developers and other focktard files. 
Automate build of your project by yourself exectly as you need.
Bash files for images and video compression included. 

## Installation
Mutihawker requires few system libraries to convert images and videos. If you want task system, you must install nodejs and all requred packages.

## Required system packages
    ./install.sys.sh
- inotify-tools
- pngquant
- rsync
- ffmpeg

## Node js
    ./install.nodejs.sh
- installing latest version of node js
- installing required node packages

## Using
1. Go to your project folder
2. Create multihawker.js file
3. Write your awesome scripts
4. Open your terminal
5. Run multihawker **from project folder**
5. Write path to multihawker folder. Multihawker going to find script file, evaluate and run it.
```
./path/to/multihawker/multihawker.sh
````
Also you can run npm directly from multihawker folder with -p key (path to your project):
```
npm run start -- -p /path/to/your_project
````

## Writing
Multihawker got some shit just out of the box:
- Images converter
- Video converter