import {default as path} from 'path'
import {default as fs} from 'fs'
import { default as cp } from 'child_process';
import consolecolors from './module.consolecolors'

const spawn = cp.spawn;

function ensureDirectoryExistence(dirPath) {
    var dirname = path.dirname(dirPath);
    if (fs.existsSync(dirname)) {
        return true;
    };
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};
/*rsync setup
* -h: human readable numbers
* -v: verbose
* -r: recurse into directories
* -P: --partial (keep partially transferred files) +
*         --progress (show progress during transfer)
* -t: preserve modification times
*/
class Images {
    constructor(root, output) {
        this.root = root;
        this.output = output;
        this.io;
        this.rsync = 'rsync';
        this.rsyncArgs = ['-rvhPt', root, output, '--out-format=%n'];
        this.findAndPngquant = [root, '-name', '*.png', '-print0', '-exec', 'pngquant', '--force', '--skip-if-larger', '--quality=80-95', '--ext', '.png', '{}', ';'];
    };
    copyFile(file) {
        var filePath = path.join(this.output, `${name}.css`);
        if (!fs.existsSync(filePath)) {
            ensureDirectoryExistence(filePath);
        };
        console.log(consolecolors.fg.Yellow, '\nwriting: ' + filePath, consolecolors.Reset);
        fs.writeFileSync(filePath, cssFile.css, function(err) {
            if (error) {
                return console.log(consolecolors.fg.Red, error, consolecolors.Reset);
            }
        });
    };
    optimize(files = []) {
        if (this.io) this.io.kill('SIGKILL');
        console.log(consolecolors.fg.Yellow, 'optimizing...', consolecolors.Reset);
        //file-by-file optimization and return 
        if(files.length > 0) {
            files.map(file => {
                this.io = spawn('pngquant', ['--force', '--skip-if-larger', '--quality=80-95', '--ext', '.png', path.join(this.root, file)])
                this.io.stderr.on('data', (data) => {
                    console.log(`stderr: ${data}`);
                });
                this.io.on('close', (code) => {
                    this.syncWithOutput();
                    console.log(consolecolors.fg.Yellow, `optimized ${file}\n`, consolecolors.Reset);
                });
            });
            return true;
        }
        //whole images dir optimization, 
        this.io = spawn('find', this.findAndPngquant);
        this.io.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });
        this.io.on('close', (code) => {
            console.log(consolecolors.fg.Yellow, `finished optimization`, consolecolors.Reset);
            this.syncWithOutput();
        });
    };
    close() {
        if (this.io) this.io.kill('SIGKILL');
        this.io = undefined;
    };
    syncWithOutput() {
        if (this.io) this.io.kill('SIGKILL');

        this.io = spawn(this.rsync, this.rsyncArgs);

        console.log(consolecolors.fg.Yellow, `${this.root} to ${this.output}\n`, consolecolors.Reset);

        this.io.stdout.on('data', (data) => {
            var event = data.toString('utf8');
            console.log(consolecolors.fg.Yellow, event, consolecolors.Reset)
        });

        this.io.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
        });

        this.io.on('close', (code) => {
            console.log(`finish sync`);
            //if (code != null) this.run(this.callback);
        });
    };
};

export {
    Images
}