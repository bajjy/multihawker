import { default as path } from 'path'
import { default as fs } from 'fs'
import { default as cp } from 'child_process';
import fff from './module.consolecolors'

const exec = cp.exec;

class Videos {
    constructor(name, folder, output, callback) {
        this.folder = folder;
        this.output = output;
        this.callback = callback;
        this.process;
    };
    run() {
        if (this.process) this.process.kill('SIGKILL');
        this.process = exec(process.cwd() + '/modules/bash/videofolder.sh ' + this.folder + ' ' + this.output, handling);
        this.process.stdout.on('data', function(data) {
            console.log(fff.fg.Green, `${data}\n`, fff.Reset);
        });
    };
};

function handling(error, stdout, stderr) {
    if (stderr) {
        //console.log('==========>', `${stderr}`)
    };
    if (error !== null) {
        console.log('xxxxxxxx>', ` watcher: ${error}`);
    }
};

export {
    Videos
}