![screenshot](https://photos-5.dropbox.com/t/2/AACu7gDIgdqRf4wl6P-8rqs8POppdnmpfnUkEjyLizeKaA/12/2191409/png/32x32/1/_/1/2/multihawker.png/EIv5gGoYAiACKAI/RtMyBj9eUYJoufsRMd02IBs65o8IL68UU-olO62qaTo?preserve_transparency=1&size=2048x1536&size_mode=3)

Multihawker is simple DIY build system created with [ecmascript 6](http://www.ecma-international.org/ecma-262/6.0/). 
Usually you neet two-three tools for comfortable work. Gulp, Webpack, Grunt those guys are completely waste. Everybody knows that `node_modules` is totally blackhole.

The goal of this project is to get rid of ton of needless packages, tools and libraries from questionable developers and other focktard files.
Automate build of your project by yourself exectly as you need. Use SINGLE tool to all of your project. 
Bash files for images and video compression included. 

## Installation
Mutihawker requires few system libraries to convert images and videos. If you want task system, you must install nodejs and all requred packages too. 

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
```
Also you can run npm directly from multihawker folder with -p key (path to your project):
```
npm run start -- -p /path/to/your_project
```

## Working with scripts
Multihawker have some shit just out of the box. You can use it **without installing node and bunch of packages** any time you need.

multihawker.sh is middleware between **Nodejs** classes and bash scripts. However scritps could be straight from folder:
```
./modules/
├── bash
│   ├── clone.sh
│   ├── help.sh
│   ├── imagefolder.sh
│   ├── logo.sh
│   ├── sed.sh
│   ├── videofolder.sh
│   └── watcher.sh
```

### Images converter
Shrink images with pngquant tool and put it to destination folder with rsync utility.
```
./path/to/multihawker/multihawker.sh videofolder ./folder_or_file/to/convert ./folder/to/put/converted_files
```

### Video converter
Prepare videos for web with ffmpeg. Creates -640 -1280 -1920 wide video from input and convert those to mp4 and webm.
```
./path/to/multihawker/multihawker.sh videofolder ./folder_or_file/to/convert ./folder/to/put/converted_files
```
### Clone tool
Simply copying files using cp utility. Allows to use wildcards in paths.
```
./path/to/multihawker/multihawker.sh clone ./folder_to file1 file2.* ./folder/*.png ... fileN
```