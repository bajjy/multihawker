import {default as path} from 'path'
import {default as fs} from 'fs'
import { default as cp } from 'child_process';
import consolecolors from './module.consolecolors'

const spawn = cp.spawn;
//inotifywait -r /folder/from/config --exclude /folder/to/exclude
class Watcher {
    constructor(name, folder, exclude, args = []) {
        this.name = name;
        this.cmd = 'inotifywait';
        this.folder = folder;
        this.exclude = exclude;
        this.args = [...args, '-r', this.folder];
        this.callback;
        this.io;
        if (exclude) {
            this.args = this.args.concat(['--exclude', `'(${ exclude.join('|') })'`]);
        };
    };
    run(callback) {
        if (!callback) return false;
        if (this.io) this.io.kill('SIGKILL');

        this.io = spawn(this.cmd, this.args);
        this.callback = callback;

        console.log(consolecolors.fg.Yellow, `${this.name} on: ${this.folder}`, consolecolors.Reset);

        this.io.stdout.on('data', (data) => {
            var event = data.toString('utf8').replace(/(\n|\r)+$/, '').split(' ');
            console.log(consolecolors.fg.Yellow, `${this.name}: ${event[0] + event[2]} is ${event[1]}`, consolecolors.Reset);
            callback(event);
        });

        this.io.stderr.on('data', (data) => {
            //console.log(`stderr: ${data}`);
        });

        this.io.on('close', (code) => {
            if (code != null) this.run(this.callback);
        });
    };
    close() {
        if (this.io) this.io.kill('SIGKILL');
        this.io = undefined;
    };
};

//run('inotifywait', ['-r', './test', '--exclude', '(node_modules|html/config.json)'])

export {
    Watcher
}