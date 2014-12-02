"use strict";

var DataStore = require('nedb')
    , config = require('./config/config')
    , path = require('path');

var db = new DataStore({
    filename: (config.dbBasePath ? path.join(config.dbBasePath, 'poc.db') : undefined),
    autoload: true
});

module.exports = db;