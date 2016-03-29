/**
 *  Webserver wrapper
 *  @module classes/webserver
 */

// Core modules
var Config = require('./config.js');
var log = require('./log.js');
var fs = require('fs');

// Webserver
var http = require('http');
var https = require('https');
var spdy = require('spdy');
var express = require('express');

// Additionals e.g. compression
var compression = require('compression');
var serve = require('serve-static')('./web/');
var multipartyMiddleware = require('connect-multiparty')();

var instance;
var startDate;

var uploadhandler = require('./uploadhandler.js');

var Webserver = function(options) {
    this.app = express();
    this.app.use(compression());
    this.app.use(serve);

    this.startDate = new Date();

    this.app.post('/plugins/upload', multipartyMiddleware, function(req,res) {
        uploadhandler.pluginFromReq(req, res, function(plugin) {
           plugin.save();
        });
    });
    this.app.post('/worlds/upload', multipartyMiddleware, function(req,res) {
        uploadhandler.worldFromReq(req, res, function(world) {
            world.save();
        });
    });

    this.app.use(function(req, res) {                                                       ////////////////
        res.status(404).send(fs.readFileSync('./web/index.html', {encoding: "UTF-8"}));     //experimental//
    });                                                                                     ////////////////

    if(Config.isHTTPSEnabled()) {
        var options = {
            key: fs.readFileSync('../keys/key.pem'),
            cert: fs.readFileSync('../keys/cert.pem'),
            ca: fs.readFileSync('../keys/ca.pem'),
            windowSize: 1024 * 1024,
            autoSpdy31: false
        };
        if (Config.isSPDYEnabled()) {
            this.webserver = spdy.createServer(options, this.app);
        } else {
            this.webserver = https.createServer(options, this.app);
        }
    } else {
        this.webserver = http.Server(this.app);
    }
};

Webserver.prototype.start = function() {
    this.webserver.listen(Config.getWebInterfacePort(), Config.getListenIP(), function(err){
        if(err){throw err;}
        log.info("Webserver listening on "+Config.getListenIP()+":"+Config.getWebInterfacePort()+"!");
    });
};

/**
 * Gets the webserver (http, https, spdy)
 * @returns {*}
 */
Webserver.prototype.getWebserver = function() {
    return this.webserver;
};

/**
 * Gets the express app
 * @returns {*}
 */
Webserver.prototype.getHttp = function() {
    return this.http;
};

/**
 * Gets the express app
 * @returns {*}
 */
Webserver.prototype.getExpressApp = function() {
    return this.app;
};

/**
 * Gets the express app
 * @returns {*}
 */
Webserver.prototype.getStartDate = function() {
    return this.startDate;
};

/**
 * Get instance of the webserver
 * @param options Webserver options.
 * @returns {*}
 */
exports.getInstance = function(options) {
    if(options && instance === undefined){instance = new Webserver(options);}
    return instance;
};