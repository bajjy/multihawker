import { default as path } from 'path'
import { default as fs } from 'fs'
import { default as cp } from 'child_process';
import fff from './module.consolecolors'

const exec = cp.exec;

class Watcher {
    constructor(name, folder, callback, exclude = '') {
        this.name = name;
        this.folder = folder;
        this.exclude = ' ' + exclude;
        this.callback = callback;
        this.process;
    };
    run() {
        if (!this.callback) return false;
        if (this.process) this.process.kill('SIGKILL');

        this.process = exec(process.cwd() + '/modules/bash/watcher.sh ' + this.folder + this.exclude, (error, stdout, stderr) => {
            handling(error, stdout, stderr, this.callback);
            this.run();
        });
    };
    close() {
        if (this.process) this.process.kill('SIGKILL');
        this.process = undefined;
    };
};

function handling(error, stdout, stderr, callback) {
    if (stdout) {
        callback( stdoutParse(stdout) );
        console.log(fff.fg.Green, `----------> ${stdout} `, fff.Reset);
    };
    if (stderr) {
        //console.log('==========>', `${stderr}`)
    };
    if (error !== null) {
        console.log('xxxxxxxx>', ` watcher: ${error}`);
    }
};

function stdoutParse(string) {
    var parse = string.toString('utf8').replace(/(\n|\r)+$/, '').split(' ');
    return parse
};
export {
    Watcher
}