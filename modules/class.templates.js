import { default as path } from 'path'
import { default as fs } from 'fs'

import consolecolors from './module.consolecolors'

var tpl;
var data;
var privateRoot;
var privateOutput;
var privateIncludes;

function ensureDirectoryExistence(dirPath) {
    var dirname = path.dirname(dirPath);
    if (fs.existsSync(dirname)) {
        return true;
    };
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

function include(name, newData, filePath) {
    filePath = path.join(filePath || privateIncludes, name + '.html');
    tpl = '`' + fs.readFileSync(filePath, 'utf8') + '`';
    try {
        return eval(tpl);
    } catch (error) {
        console.log(consolecolors.fg.Red, error, consolecolors.Reset);
        return false
    };
};

class Templates {
    constructor(root, output, includes) {
        this.root = root;
        this.output = output;
        this.includes = includes;
        privateRoot = this.root;
        privateOutput = this.output;
        privateIncludes = this.includes;
    };

    writeFile(name, tplFile) {
        var filePath = path.join(this.output, `${name}.html`);
        if (!fs.existsSync(filePath)) {
            ensureDirectoryExistence(filePath);
        };
        fs.writeFileSync(filePath, tplFile, function (err) {
            if (error) {
                return console.log(consolecolors.fg.Red, error, consolecolors.Reset);
            }
        });
    };

    render(name, filePath, data = {}) {
        var template;
        if (path.relative(filePath, this.includes).length == 0) return this.first()
        name = path.basename(name, path.extname(name));
        template = include(name, data, filePath);
        this.writeFile(name, template);
    };

    first() {
        fs.readdirSync(this.root).forEach(file => {
            var filePath = path.join(this.root, file);
            var stat = fs.statSync(filePath);
            console.log(consolecolors.fg.Yellow, 'render: ' + filePath, consolecolors.Reset);
            if (stat.isFile()) {
                this.render(file, this.root);
            };
        });
    };
};

export {
    Templates
}