![screenshot](http://bajjy.com/images/multihawker_logo.svg)

Multihawker is simple DIY build system created with [ecmascript 6](http://www.ecma-international.org/ecma-262/6.0/). 
Usually you need two-three tools for comfortable work. Gulp, Webpack, Grunt those guys are completely waste. Everybody knows that `node_modules` is totally blackhole.

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
- imagemagick

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
```
Usage: mutihawker [OPTION]...
Run multihawker script in your directory.
Or specific Bash scripts.

-p    Project folder where multihawker.js file is already created
-t    Execute one of multihawker Bash scripts
      Usage: -t [taskname] [OPTIONS]
--help    show helpfile
```
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
./path/to/multihawker/multihawker.sh -t imagefolder ./folder_or_file/to/convert ./folder/to/put/converted_files
```

### Video converter
Prepare videos for web with ffmpeg. Creates -640 -1280 -1920 wide video from input and convert those to mp4 and webm.
```
./path/to/multihawker/multihawker.sh -t videofolder ./folder_or_file/to/convert ./folder/to/put/converted_files
```
### Sprites generator
Convert video frames to png images than create folder called \"sprites\" with horizontal combined png's
```
./path/to/multihawker/multihawker.sh -t spritegenerator ./folder_or_file/to/convert ./folder/to/put/converted_files
```
### Clone tool
Simply copying files using cp utility. Allows to use wildcards in paths.
```
./path/to/multihawker/multihawker.sh clone ./folder_to file1 file2.* ./folder/*.png ... fileN
```
## Example multihawker.js file

```js
/*
Write your automation in this file. You can manipulate multihawker tasks from * this file. Or you can simply write js or es6 code here and work with your 
files.
*/

var root = '/path/to/project';
//you can pass additional keys to js file
var projectName = process.argv[process.argv.indexOf('-c') + 1];
//input
var from = (pth) => path.join(root, 'src', projectName, pth);
//output
function to(pth) {
    var dirPath = path.join(root, 'html', projectName, pth);
    ensureDirectoryExistence(dirPath);
    return dirPath
};
//fuction to create folders if doesnt exist
function ensureDirectoryExistence(dirPath) {
    var dirname = path.dirname(dirPath);
    if (fs.existsSync(dirname)) {
        return true;
    };
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

/*
js task.
It is use Rollup to bundle es6 files with imports and put it into output folder with `to` function
*/
function js() {
    var rollup = new Rollup(
        from('/js/app'), 
        to('/js'), 
        ['main.js', 'main/']
    );
    var rollupWatch = new Watcher(
        from('/js'), 
        from('/js'), 
        (cb) => rollup.build()
    );
    rollup.build();
    rollupWatch.run();
};

function css() {
    var less = new Less(
        from('/less/main.less'), 
        to('/css')
    );
    var lessMain = new Less(
        from('/less/main/'), 
        to('/css')
    );
    var lessWatch = new Watcher(
        from('/less'), 
        from('/less'), 
        (cb) => less.render(cb[2], cb[0]));
    less.first();
    lessMain.first();
    lessWatch.run();
};

function tpl() {
    var tpl = new Templates(
        from('/html'), 
        to('/'), 
        from('/html/includes')
    );
    var tplWatch = new Watcher(
        from('/html'), 
        from('/html'), 
        (cb) => tpl.render(cb[2], cb[0])
    );
    tpl.first();
    tplWatch.run();
};

function clone() {
    var cloneFonts = new Clone(
        [
            path.join(root, 'src', 'vendor/material-design-icons/iconfont/MaterialIcons-Regular.eot'),
            path.join(root, 'src', 'vendor/material-design-icons/iconfont/MaterialIcons-Regular.woff'),
            path.join(root, 'src', 'vendor/material-design-icons/iconfont/MaterialIcons-Regular.woff2'),
            path.join(root, 'src', 'vendor/material-design-icons/iconfont/MaterialIcons-Regular.ttf'),
            path.join(root, 'src', 'vendor/roboto-fontface-bower/fonts/roboto/*')
        ],
        to('/css/fonts/')
    );
    //create all folders if doesnt exist
    to('/css/fonts/*')
    cloneFonts.run();
};

clone();
js();
css();
tpl();
```
