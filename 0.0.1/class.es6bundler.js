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
function writeFile(name, file, output) {
    var filePath = path.join(output, `${name}.js`);
    if (!fs.existsSync(filePath)) {
        ensureDirectoryExistence(filePath);
    };
    console.log(consolecolors.fg.Yellow, '\nwriting: ' + filePath, consolecolors.Reset);
    fs.writeFileSync(filePath, file, function(err) {
        if (error) {
            return console.log(consolecolors.fg.Red, error, consolecolors.Reset);
        }
    });
};
function readFile(filepath) {
    var content = fs.readFileSync(filepath, 'utf8');
    return content
};

function parseAndAssemble(filepath) {
    var content;
    var importStrings;
    var dir;
    var bundled;
    function imp() {
        importStrings.map(line => {
            var commands = line.split(' ');
            var importPath = commands[commands.length - 1].split('"')[1] || commands[commands.length - 1].split('\'')[1];
            var importFile = path.resolve(dir, importPath + '.js');
            var as = [];
            parseAndAssemble(importFile)
                .then(imported => {
                    commands.map(function (val, i) {
                        if (val != 'as') return false;
                        if (commands[i - 1] == '*') return false;
                        commands[i + 1] = commands[i + 1].replace(',', '');
                        commands[i - 1] = commands[i - 1].replace(',', '');
                        as.push('var ' + commands[i + 1] + ' = ' + commands[i - 1] + ';')
                    });
                    bundled = as.join('\n');
                    bundled += '\n';
                    bundled += imported;
                    console.log(bundled)
                    resolve(bundled)
                })
        });
    };
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(filepath)) reject({error: 'file is not exist'});
        if (!fs.statSync(filepath).isFile()) reject({error: filepath + ' is not file'});

        content = fs.readFileSync(filepath, 'utf8');
        dir = path.join(filepath, '../');

        importStrings = content.split('\n').filter(function (val) {
            return val.indexOf("import") != -1;
        });

        if (importStrings.length == 0) {
            resolve(content);
        };
        if (importStrings.length > 0) {
            imp();
        };

    });
    
}
function parse(filepath) {
    if (fs.existsSync(filepath)) return false
    var filePath = filepath;
    var dirPath = path.join(filePath, '../');
    var stat = fs.statSync(filePath);
    var lines;
    if (stat.isFile()) {
        var content = fs.readFileSync(filepath, 'utf8');
        console.log(consolecolors.fg.Green, filePath, consolecolors.Reset);
        console.log(consolecolors.fg.Red, content.split('\n')[0], consolecolors.Reset);
        lines = content.split('\n').filter(function (val) {
            return val.indexOf("import") != -1;
        });
        console.log(filePath)
        lines = importing(lines, dirPath);
    }

    return lines
};
function importing(lines, dir) {
    var bundled = '';
    lines.map(line => {
        
        var commands = line.split(' ');
        var importPath = commands[commands.length - 1].split('"')[1] || commands[commands.length - 1].split('\'')[1];
        var importFile = path.resolve(dir, importPath + '.js');
        var imported;
        var as = [];

        if (fs.existsSync(importFile)) imported = parseAndAssemble(importFile);

        commands.map(function (val, i) {
            if (val != 'as') return false;
            if (commands[i - 1] == '*') return false;
            commands[i + 1] = commands[i + 1].replace(',', '');
            commands[i - 1] = commands[i - 1].replace(',', '');
            as.push('var ' + commands[i + 1] + ' = ' + commands[i - 1] + ';')
        });
        bundled = as.join('\n');
        bundled += '\n';
        bundled += imported;
    })

    return bundled
};
/*rsync setup
* -h: human readable numbers
* -v: verbose
* -r: recurse into directories
* -P: --partial (keep partially transferred files) +
*         --progress (show progress during transfer)
* -t: preserve modification times
*/
class Bundler {
    constructor(root, output, includes) {
        this.root = root;
        this.output = output;
        this.includes = includes;
        this.io;
        this.rsync = 'rsync';
        this.rsyncArgs = ['-rvhPt', root, output, '--out-format=%n'];
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
    bundle() {
        var files;
        //var find = spawn('find', [this.root, 'not', 'path', `"*${this.includes}*"`]);
        // find.stdout.on('data', (data) => {
        //     files = data.toString('utf8').split("\n")
        // });
        //find.stdout.on('close', (data) => {
        //    files.map(file => {
        //    })
        //});

        fs.readdirSync(this.root).forEach(file => {
            if (fs.existsSync( path.join(this.root, file) )) {
                parseAndAssemble(path.join(this.root, file))
                    .then(data => {
                        
                    })
                    .catch((error) => {
                        
                    });
            };
        });
    };
};

export {
    Bundler
}