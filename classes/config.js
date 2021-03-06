/**
 * Config wrapper
 * @module classes/config
 */

var config = require('../config.json');
var fs = require('fs');
var log = require('./log.js');

/**
 * Gets the mongo host
 * @returns {string}
 */
exports.getMongoHost = function() {
    return config.database.host;
};

/**
 * Sets the mongo host
 * @param value The host
 */
exports.setMongoHost = function(value) {
    config.database.host = value;
};

/**
 * Gets the mongo database name
 * @returns {string}
 */
exports.getMongoDatabase = function() {
    return config.database.database;
};

/**
 * Gets the mongo database name
 * @param value The mysql database name
 */
exports.setMongoDatabase = function(value) {
    config.database.database = value;
};

/**
 * Gets the mongo port
 * @returns {string}
 */
exports.getMongoPort = function() {
    return config.database.port;
};

/**
 * Sets the mongo post
 * @param value The port
 */
exports.setMongoPort = function(value) {
    config.database.port = value;
};

/**
 * Gets the mongo user
 * @returns {string}
 */
exports.getMongoUser = function() {
    return config.database.user;
};

/**
 * Sets the mongo user
 * @param value The user
 */
exports.setMongoUser = function(value) {
    config.database.user = value;
};

/**
 * Gets the mongo password
 * @returns {string}
 */
exports.getMongoPassword = function() {
    return config.database.password;
};

/**
 * Sets the mongo password
 * @param value The password
 */
exports.setMongoPassword = function(value) {
    config.database.password = value;
};

/**
 * Gets the webinterface port
 * @returns {int}
 */
exports.getWebInterfacePort = function() {
    return config.wi_port;
};

/**
 * Sets the webinterface port
 * @param value The webinterface port
 */
exports.setWebInterfacePort = function(value) {
    config.mysql.wi_port = value;
};

/**
 * Checks if https is enabled
 * @returns {boolean}
 */
exports.isHTTPSEnabled = function() {
    return config.https.enabled;
};

/**
 * Sets the value whether to enable https or not
 * @param value true or false
 */
exports.setHTTPSEnabled = function(value) {
    config.https.enabled = value;
};

/**
 * Checks if SPDY (HTTP/2.0) is enabled
 * @returns {boolean}
 */
exports.isSPDYEnabled = function() {
    return config.https.spdy;
};

/**
 * Sets the value whether to enable SPDY (HTTP/2.0) or not
 * @param value true or false
 */
exports.setSPDYEnabled = function(value) {
    config.https.spdy = value;
};

/**
 * Gets the domain of the webinterface
 * @returns {string}
 */
exports.getDomain = function() {
    return config.domain;
};

/**
 * Sets the domain of the webinterface
 * @param value The domain
 */
exports.setDomain = function(value) {
    config.domain = value;
};

/**
 * Gets the port where the daemons connect
 * @returns {int}
 */
exports.getCloudSystemPort = function() {
    return config.cloudsystem_port;
};

/**
 * Sets the port where the daemons connect
 * @param value The port
*/
exports.setCloudSystemPort = function(value) {
    config.cloudsystem_port = value;
};

/**
 * Gets the IP where the webserver should listen
 * @returns {string}
 */
exports.getListenIP = function() {
    return config.listenip;
};

/**
 * Sets the IP where the webserver should listen
 * @param value The IP
 */
exports.setListenIP = function(value) {
    config.listenip = value;
};

/**
 * Checks if the cloudsystem is in debug mode
 * @returns {boolean}
 */
exports.isDebugMode = function() {
    return config.debug;
};

/**
 * Sets the value whether the cloudsystem is in debug mode or not
 * @param value The value
 */
exports.setDebugMode = function(value) {
    config.debug = value;
};

/**
 * Checks if the cloudsystem is in maintenance mode
 * @returns {boolean}
 */
exports.isMaintenanceMode = function() {
    return config.maintenance;
};

/**
 * Sets the value whether the cloudsystem is in maintenance mode or not
 * @param value The value
 */
exports.setMaintenanceMode = function(value) {
    config.maintenance = value;
};

/**
 * Checks if the setup is required
 * @returns {boolean}
 */
exports.isSetupRequired = function() {
    return config.setup;
};

/**
 * Sets the setup finished
 */
exports.setSetupFinished = function() {
    config.setup = false;
};

/**
 * Saves the current configuration
 * */
exports.save = function(callback) {
    log.info("Saving config...");
    fs.writeFile("./config.json", JSON.stringify(config, null, 2), {}, function(err) {
        if(err) {
            log.error("An error occurred while saving config!");
        } else {
            log.info("Saved config successfully!");
        }
        callback();
    });
};