import { default as path } from 'path'
import { default as fs } from 'fs'

import { default as rollup } from 'rollup';

class Rollup {
    constructor(input, output, files) {
        this.input = input;
        this.output = output;
        this.files = files;
        this.count = 0;
    };
    bundle(path, file, output = this.output) {
        return rollup.rollup({
            input: path
        })
        .then(bndl => {
                return bndl.write({
                    file: output + '/' + file,
                    name: file,
                    format: 'iife',
                    sourcemap: false
                })
        })
        .catch(error => console.log(error));
    };
    build() {
        var fileOrFolderPath = path.join(this.input, this.files[this.count]);
        var stat = fs.statSync(fileOrFolderPath);
        
        if (!stat.isFile()) {
            fs.readdirSync(fileOrFolderPath).forEach(file => {
                var filePath = path.join(fileOrFolderPath, file);
                this.bundle(filePath, file)
                    .catch(error => console.log(error));
            });
        };
        if (this.count >= this.files.length - 1) {
            this.count = 0;
            return console.log('Rollup finished')
        };
        this.bundle(fileOrFolderPath, this.files[this.count])
            .then(() => {
                ++this.count;
                this.build();
            })
            .catch(error => console.log(error));
    };
    first() {
        if (fs.statSync(this.root).isFile()) {
            return this.render(this.root, '');
        };
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
    Rollup
}