const fsExtra = require('fs-extra');
const {logger} = require('./utils');

class CopyAfterEmitPlugin {
    constructor(options) {
        this.options = Object.assign({
            from: '',
            to: ''
        }, options);
    }

    apply(compiler) {
        compiler.hooks.afterEmit.tapAsync({name: 'CopyAfterEmitPlugin', stage: 9999}, (compilation, callback) => {
            let tipTitle = `[CopyAfterEmitPlugin] copy (${this.options.from}) to (${this.options.to})`;
            fsExtra.copy(this.options.from, this.options.to).then(() => {
                logger.info(`[${new Date().toLocaleString()}] ${tipTitle} completed.`);
            }).catch(e => {
                logger.error(`[${new Date().toLocaleString()}] ${tipTitle} 出错\n${e && e.message}`);
            }).then(callback);
        });
    }
}


module.exports = CopyAfterEmitPlugin;
