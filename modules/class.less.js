import {default as less} from 'less'
import {default as path} from 'path'
import {default as fs} from 'fs'

import consolecolors from './module.consolecolors'

function ensureDirectoryExistence(dirPath) {
    var dirname = path.dirname(dirPath);
    if (fs.existsSync(dirname)) {
        return true;
    };
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

class Less {
    constructor(root, output, includes) {
        this.root = root;
        this.output = output;
        this.includes = includes;
        this.options = {
            // paths: [this.includes]
            // filename: 'style.less' // Specify a filename, for better error messages
        };
    }
    writeFile(name, cssFile) {
        var filePath = path.join(this.output, `${name}.css`);
        if (!fs.existsSync(filePath)) {
            ensureDirectoryExistence(filePath);
        };

        fs.writeFileSync(filePath, cssFile.css, function(err) {
            if (error) {
                return console.log(consolecolors.fg.Red, error, consolecolors.Reset);
            }
        });
    };
    render(name, filePath) {
        var options;
        var ff;
        //if (path.relative(filePath, this.includes).length == 0) return this.first() 

        filePath = path.join(filePath, name);
        options = this.options;
        options['filename'] = name;

        if (fs.statSync(filePath).isFile()) {
            ff = fs.readFileSync(filePath, 'utf8');

            less.render(ff, {
                filename: path.resolve(filePath)
            })
                .then((css) => {
                    this.writeFile(path.basename(name, path.extname(name)), css);
                },
                (error) => console.log(consolecolors.fg.Red, error, consolecolors.Reset));
        };
    };
    first() {
        if (fs.statSync(this.root).isFile()) {
            return this.render(this.root, '');
        };
        fs.readdirSync(this.root).forEach(file => {
            var filePath = path.join(this.root, file);
            var stat = fs.statSync(filePath);

            if (stat.isFile()) {
                this.render(file, this.root);
            };
        });
    }
};

export {
    Less
}