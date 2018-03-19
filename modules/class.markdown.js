import { default as path } from 'path'
import { default as fs } from 'fs'
import { default as cp } from 'child_process';
import { default as md } from 'markdown-js';
const exec = cp.spawn;

class Markdown {
    constructor(markdown, callback) {
        this.md = markdown;
        this.callback = callback;
        this.process;
    };
    run() {
        if (this.process) this.process.kill('SIGKILL');
        return md.makeHtml(this.md)
    };
};

function handling(error, stdout, stderr) {
    if (stdout) {
        console.log('**********>\\', `${stdout}`)
    };
    if (stderr) {
        console.log('==========>', `${stderr}`)
    };
    if (error !== null) {
        console.log('xxxxxxxx>', ` clone: ${error}`);
    }
};

export {
    Markdown
}