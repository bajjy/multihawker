import {default as path} from 'path'
import {default as fs} from 'fs'

import consolecolors from './module.consolecolors'
import { Watcher } from './class.watcher'
import { Less } from './class.less'
import { Templates } from './class.templates'
import { Images } from './class.images'
import { Bundler } from './class.es6bundler'

const routes = {
    'tasker': tasker,
    'less': less,
    'tpl': tpl,
    'images': images,
    'js': js,
    'bundle': bundle,
    'info': info
}
const taskDescription = {
    'tasker': `runs all the tasks one by one, which are specified in the config file
        format: command <config>`,
    'less': `render less files into css.
        format: command <config>`,
    'tpl': `convert es6 templates into valid html files.
        format: command <config>`,
    'images': `minify images and put them into target folder
        format: command <config>
        format: command <config> ./file ./file`,
    'js': `put js files from src to output dir.
        format: command <config>
        format: command <config> <bundle>`,
    'bundle': `bundling js files using es6 import keyword.
        format: command`,
    'info': `output information about curren processes.
        format: command`
};
var projects = new Map();
var processes = new Map();
var globalProjectList = JSON.parse( fs.readFileSync('./projects.json', 'utf8') );

/*PROJECTS AUTOLOAD*/
globalProjectList.projects.map(confAddress => {
    if (!fs.existsSync(confAddress)) {
        console.log(consolecolors.fg.Red, confAddress + " is not found", consolecolors.Reset);
        return false
    };
    router('tasker ' + confAddress);
})

console.log(consolecolors.fg.Green,'Multihawker 0.0.1', consolecolors.Reset);
console.log(consolecolors.fg.Green,'Constantine Dobrovolskiy http://bajjy.com', consolecolors.Reset);
console.log(consolecolors.fg.Green,'now you can run commands: command <config> <options>', consolecolors.Reset);

if (process.pid) {
    console.log('This process is your pid ' + process.pid);
};

for (let r in routes) {
    console.log(consolecolors.fg.Cyan, '--------------------', consolecolors.Reset);
    console.log(consolecolors.fg.Cyan, r, consolecolors.Reset);
    console.log(consolecolors.fg.Cyan, taskDescription[r], consolecolors.Reset);
};
console.log(consolecolors.fg.Cyan, '--------------------', consolecolors.Reset);
//router('bundle ./test/config.json');
process.title = 'multihawker';
process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (chunk) => {
    if(!chunk || chunk.length <= 0) return console.log('please specify the command')
    router(chunk);
});
function info() {
    console.log(consolecolors.fg.Cyan, processes.size + ' project are currently run', consolecolors.Reset);
    processes.forEach(function(value, key, myMap) {
        console.log(consolecolors.fg.Cyan, '--------------------', consolecolors.Reset);
        console.log(consolecolors.fg.Cyan, key, consolecolors.Reset);
        console.log(consolecolors.fg.Cyan, value, consolecolors.Reset);
    })
};
function tasker(input) {
    var task = 'watch';
    var config;
    var input = input[0];
    if (!input || !fs.existsSync(input)) {
        console.log(consolecolors.fg.Red, input + " is not found", consolecolors.Reset);
        return false
    };
    config = JSON.parse( fs.readFileSync(input, 'utf8') );
    projects.set(config.name, config);

    if (!processes.has(config.name)) {
        processes.set(config.name, {});
    };

    console.log(consolecolors.fg.Green, config.name + ' processing...', consolecolors.Reset);

    for (let task in config) {
        if (isObject(config[task])) {
            if (processes.has(config.name) && processes.get(config.name)[task]) {
                processes.get(config.name)[task].close();
            }
            router(task + ' ' + input);
        }
    };
};

function less(input) {
    var task = 'less';
    var config = JSON.parse( fs.readFileSync(input[0], 'utf8') );
    //TASK FOLDERS
    var root = path.join(config.root, config.less.root);
    var output = path.join(config.root, config.less.output);
    var includes = path.join(config.root, config.less.includes);
    var lessModule = new Less(root, output, includes);

    projects.set(config.name, config);

    if (!processes.has(config.name)) {
        processes.set(config.name, {});
    };

    console.log(consolecolors.fg.Yellow, 'setup: ' + task, consolecolors.Reset);
    lessModule.first();
    processes.get(config.name)[task] = new Watcher(task, root);
    processes.get(config.name)[task].run((data) => {
        console.log(consolecolors.fg.Yellow, '-------------------------', consolecolors.Reset);
        lessModule.render(data[2], data[0])
    });
};

function tpl(input) {
    var task = 'tpl';
    console.log(input)
    var config = JSON.parse( fs.readFileSync(input[0], 'utf8') );
    
    //TASK FOLDERS
    var root = path.join(config.root, config.tpl.root);
    var output = path.join(config.root, config.tpl.output);
    var includes = path.join(config.root, config.tpl.includes);
    var tplModule = new Templates(root, output, includes);
    
    projects.set(config.name, config);

    if (!processes.has(config.name)) {
        processes.set(config.name, {});
    };

    console.log(consolecolors.fg.Yellow, 'setup: ' + task, consolecolors.Reset);
    tplModule.first();
    processes.get(config.name)[task] = new Watcher(task, root);
    processes.get(config.name)[task].run((data) => {
        console.log(consolecolors.fg.Yellow, '-------------------------', consolecolors.Reset);
        tplModule.render(data[2], data[0])
    });
};

function images(input) {
    var task = 'images';
    var config = JSON.parse( fs.readFileSync(input[0], 'utf8') );
    var files;
    //TASK FOLDERS
    var root = path.join(config.root, config.images.root);
    var output = path.join(config.root, config.images.output);
    var imagesModule = new Images(root, output);

    if (input[1]) files = input.slice(1);
    projects.set(config.name, config);

    if (!processes.has(config.name)) {
        processes.set(config.name, {});
    };

    console.log(consolecolors.fg.Yellow, 'setup: ' + task, consolecolors.Reset);
    imagesModule.optimize(files);
};

function js(input) {
    var task = 'js';
    var config = JSON.parse( fs.readFileSync(input[0], 'utf8') );
    //TASK FOLDERS
    var root = path.join(config.root, config.js.root);
    var output = path.join(config.root, config.js.output);
    var includes = path.join(config.root, config.js.includes);
    var jsModule = new Bundler(root, output, includes);

    projects.set(config.name, config);

    if (!processes.has(config.name)) {
        processes.set(config.name, {});
    };

    console.log(consolecolors.fg.Yellow, 'setup: ' + task, consolecolors.Reset);
    jsModule.syncWithOutput();
    processes.get(config.name)[task] = new Watcher(task, root);
    processes.get(config.name)[task].run((data) => {
        console.log(consolecolors.fg.Yellow, '-------------------------', consolecolors.Reset);
        jsModule.syncWithOutput();
    });
};
function bundle(input) {
    var task = 'bundle';
    var config = JSON.parse( fs.readFileSync(input[0], 'utf8') );
    //TASK FOLDERS
    var root = path.join(config.root, config.js.root);
    var output = path.join(config.root, config.js.output);
    var includes = path.join(config.root, config.js.includes);
    var jsModule = new Bundler(root, output, includes);

    projects.set(config.name, config);

    if (!processes.has(config.name)) {
        processes.set(config.name, {});
    };

    console.log(consolecolors.fg.Yellow, 'setup: ' + task, consolecolors.Reset);
    jsModule.bundle();
    processes.get(config.name)[task] = new Watcher(task, root);
    processes.get(config.name)[task].run((data) => {
        console.log(consolecolors.fg.Yellow, '-------------------------', consolecolors.Reset);
        jsModule.bundle();
    });
};
function router(input) {
    var args;
    var params;
    input = input.replace(/(\n|\r)+$/, '');
    if (/ /.test(input)) {
        var argsdata = input.split(' ');
        args = argsdata.shift();
        params = argsdata;
    } else {
        args = input
    };
    if (routes[args]) {
        return routes[args](params)
    } else {
        console.log(consolecolors.fg.Red, args + " - no such command", consolecolors.Reset);
    }
};

function isObject(o) {
    return o instanceof Object && o.constructor === Object;
};
// var ww = new Watcher('test', './test', ['node_modules', 'html/config.json']);
// libless.setFolders([
//     path.join(project.config.root, project.config.less.root),
//     path.join(project.config.root, project.config.less.output),
//     path.join(project.config.root, project.config.less.root, project.config.less.includes)
// ]);