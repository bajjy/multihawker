import { default as path } from 'path'
import { default as fs } from 'fs'

const defaultCfg = {
    root: '',
    head: 'head.html',
    header: 'header.html',
    footer: 'footer.html',
    includes: '/includes',
    css: '/css',
    js: '/js'
};
var p = (tail, head) => head + tail;

function ensureDirectoryExistence(dirPath) {
    var dirname = path.dirname(dirPath);
    if (fs.existsSync(dirname)) {
        return true;
    };
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

function tpl(name, cfg = defaultCfg) {
    var cfg = Object.assign({}, defaultCfg, cfg);
    return `<!DOCTYPE html>
<html>
    \${include('${cfg.head}', {
        "styles": "<link rel='stylesheet' href='${p(cfg.css, cfg.root)}/${name}.css' type='text/css' />"
    })}

    <body>
        \${include('${cfg.header}')}
        \${include('${name + '-main.html'}')}
        \${include('${cfg.footer}', {
            "scripts": "<script src='${p(cfg.js, cfg.root)}/${name}.js'></script>"
        })}
    </body>
</html>`
};

function create(root, name, cfg = {}, tplConfig = defaultCfg) {
    var config = {
        js: ['/js/' + name + '.js', ''],
        less: ['/less/' + name + '.less', ''],
        main: ['/html/includes/' + name + '-main.html', ''],
        html: ['/html/' + name + '.html', tpl(name, tplConfig)],
    };
    config = Object.assign({}, config, cfg);
    
    for (let key in config) {
        ensureDirectoryExistence(root + config[key][0]);
        fs.writeFileSync(root + config[key][0], config[key][1]);
    };
};
export {
    tpl,
    create
}