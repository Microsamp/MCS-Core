/**
 * Helper class for logging
 * @module classes/log
 */

var Config = require('./config.js');

var log = [];
var logcb;

function doCallback(msg) {
    log.push(msg);
    if(logcb != undefined) logcb(msg);
}

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    return hour + ":" + min + ":" + sec;
}

/**
 * Sets the callback for logging
 * @param callback The callback
 */
exports.setCallback = function(callback) {
    logcb = callback;
};

/**
 * Displays the message as an info
 * @param msg The message
 */
exports.info = function(msg) {
    doCallback('[' + getDateTime() + '] ' + msg);
    console.log('\x1b[32m[INFO '+getDateTime()+'] \x1b[37m'+msg);
};

/**
 * Displays the message as a debug
 * @param msg The message
 */
exports.debug = function(msg){
    if(Config.isDebugMode()){
        doCallback('[' + getDateTime() + '] [DEBUG] ' + msg);
        console.log('\x1b[36m[DEBUG '+getDateTime()+'] \x1b[37m'+msg);
    }
};

/**
 * Displays the message as an error
 * @param msg The message
 */
exports.error = function(msg) {
    doCallback('[' + getDateTime() + '] ' + msg);
    console.log('\x1b[31m[ERROR '+getDateTime()+'] \x1b[37m'+msg);
};

/**
 * Displays the message as a warning
 * @param msg The message
 */
exports.warn = function(msg){
    doCallback('[' + getDateTime() + '] ' + msg);
    console.log('\x1b[33m[WARNING '+getDateTime()+'] \x1b[37m'+msg);
};

/**
 * Gets the log
 * @returns {Array}
 */
exports.getLog = function() {
    return log;
};