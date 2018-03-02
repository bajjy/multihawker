import {default as path} from 'path'
import {default as fs} from 'fs'
import { default as cp } from 'child_process';

import { Processes } from './modules/class.processes'
import { Rollup } from './modules/class.rollup'
import { Watcher } from './modules/class.watcher'
import { Images } from './modules/class.images'
import { Videos } from './modules/class.videos'
import { Less } from './modules/class.less'
import { Templates } from './modules/class.templates'
import consolecolors from './modules/module.consolecolors'

const exec = cp.exec;
var project;
var filePath;
var content;

if (process.argv.indexOf('-t') != -1) {
    var argv = process.argv.slice(process.argv.indexOf('-t') + 1, process.argv.length);
    var task = argv.shift();
    var args = argv.join(' ') //add project path process.argv[process.argv.indexOf('-p') + 1]
    
    console.log(`${process.cwd()}/modules/bash/${task}.sh ${args}`);
    //exec(`${process.cwd()}/modules/bash/${task}.sh ${args}`, (error, stdout, stderr) => console.log(stdout));
    process.exit(0);
};

if (process.argv.indexOf('-p') == -1) {
    console.log('Project is not specified. Use:');
    console.log('npm run start -p /path/to/project');
    process.exit(1);
};

exec(process.cwd() + '/modules/bash/logo.sh', (error, stdout, stderr) => console.log(stdout));

project = process.argv[process.argv.indexOf('-p') + 1];
console.log('----' + project.replace(/./g, "-"));
console.log('| ' + project + ' |')
console.log('----' + project.replace(/./g, "-"));
console.log('');

filePath = path.join(project, 'multihawker.js');
content = fs.readFileSync(filePath, 'utf8');

try {
    eval(content);
} catch (error) {
    console.log(consolecolors.fg.Red, error, consolecolors.Reset);
    process.exit(1);
};

//var rp = new Rollup('./test/src/js', './test/html/js', ['sihred.js', 'index.js', 'main.js', 'chibitactics.js']);
//rp.build();
// var wt = new Watcher('./test', './test', (cb) => { console.log('+++++++++> ' + cb) }, './test/node_modules');
// wt.run();
// var wt = new Images('test', process.cwd() + '/test/src/images/', process.cwd() + '/test/html/');
// wt.run();
// var wt = new Videos('test', process.cwd() + '/test/src/video/', process.cwd() + '/test/html/video');
// wt.run();

// var lessModule = new Less('/mnt/c/Users/bajjy/www/multihawker/test', '/html/css', '/includes');
// lessModule.first();

export {
    Rollup,
    Watcher,
    Images,
    Videos,
    Less,
    Templates
}