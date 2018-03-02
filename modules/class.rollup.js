import { default as rollup } from 'rollup';

class Rollup {
    constructor(input, output, files) {
        this.input = input;
        this.output = output;
        this.files = files;
        this.count = 0;
    };
    bundle(file, output = this.output) {
        return rollup.rollup({
            input: this.input + '/' + file
        })
        .then(bndl => {
                return bndl.write({
                    file: output + '/' + file,
                    format: 'iife',
                    sourcemap: false
                })
        })
        .catch(error => console.log(error));
    };
    build() {
        this.bundle(this.files[this.count])
            .then(() => {
                console.log(this.files[this.count])
                if (this.count >= this.files.length - 1) {
                    this.count = 0;
                    return console.log('Rollup finished')
                };
                ++this.count;
                this.build();
            });
    };
};

export {
    Rollup
}