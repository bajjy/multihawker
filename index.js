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
import { Clone } from './modules/class.clone'
import consolecolors from './modules/module.consolecolors'

const exec = cp.exec;
var project;
var filePath;
var content;

function stateSingleBashTask() {
    var argv = process.argv.slice(process.argv.indexOf('-t') + 1, process.argv.length);
    var task = argv.shift();
    var projectPath = process.argv[2]; //0 - is node path, 1 - current script path, 2 - project path ... - other args

    //replacing relative paths with full paths
    argv.forEach((el, i) => {
        if (el.indexOf('./') >= 0) argv[i] = projectPath + '/' + el.split('./')[1];
    });
    argv = argv.join(' ');
    
    exec(`${process.cwd()}/modules/bash/${task}.sh ${argv}`, (error, stdout, stderr) => console.log(stdout));
};

function stateNodeScript() {
    project = process.argv.indexOf('-p') >= 0 ? process.argv[process.argv.indexOf('-p') + 1] : process.argv[2];
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
};

function stateHelp() {
    exec(process.cwd() + '/modules/bash/help.sh', (error, stdout, stderr) => console.log(stdout));
};

if (process.argv.indexOf('-t') >= 0) {
    exec(process.cwd() + '/modules/bash/logo.sh', (error, stdout, stderr) => console.log(stdout));
    setTimeout(() => stateSingleBashTask(), 500);
} 
else if (process.argv.indexOf('--help') >= 0) {
    stateHelp();
}
else {
//if (process.argv.indexOf('-p') >= 0) {
    exec(process.cwd() + '/modules/bash/logo.sh', (error, stdout, stderr) => console.log(stdout));
    setTimeout(() => stateNodeScript(), 500);
};

export {
    Rollup,
    Watcher,
    Images,
    Videos,
    Less,
    Templates
}