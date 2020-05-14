/* eslint-disable no-console */
const path = require('path');
const chalk = require('chalk');
const log = console.log;

function resolve() {
    return path.resolve(__dirname, '..', ...arguments);
}

function logger(msg='') {
    log('\n', msg);
}
logger.info = function(msg='') {
    log('\n', chalk.blue(msg));
}
logger.success = function(msg='') {
    log('\n', chalk.green(msg));
}
logger.warn = function(msg='') {
    log('\n', chalk.yellow(msg));
}
logger.error = function(msg='') {
    log('\n', chalk.bold.bgRed('ERROR') + ' ' + chalk.bold.red(msg));
}

module.exports = {
    resolve,
    logger
}
