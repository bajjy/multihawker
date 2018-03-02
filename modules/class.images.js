import { default as path } from 'path'
import { default as fs } from 'fs'
import { default as cp } from 'child_process';
import fff from './module.consolecolors'

const exec = cp.exec;

class Images {
    constructor(name, folder, output, callback) {
        this.folder = folder;
        this.output = output;
        this.callback = callback;
        this.process;
    };
    run() {
        if (this.process) this.process.kill('SIGKILL');
        this.process = exec(process.cwd() + '/modules/bash/imagefolder.sh ' + this.folder + ' ' + this.output, handling);
    };
};

function handling(error, stdout, stderr) {
    if (stdout) {
        console.log(fff.fg.Green, `----------> ${stdout}`, fff.Reset);
    };
    if (stderr) {
        console.log('==========>', `${stderr}`)
    };
    if (error !== null) {
        console.log('xxxxxxxx>', ` watcher: ${error}`);
    }
};

export {
    Images
}