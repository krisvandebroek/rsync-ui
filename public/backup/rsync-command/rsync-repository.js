"use strict";

var db = require('rsync/db')
    , _ = require("underscore")
    , RsyncConfig = require('./rsync-config');

var rsyncRepository = {

    /**
     * @param rsyncConfig {RsyncConfig}
     * @param callback {function(String)}
     */
    save: function save(rsyncConfig, callback) {
        if (!rsyncConfig || rsyncConfig.constructor.prototype !== RsyncConfig.prototype) {
            callback('RsyncConfig is required');
        } else {
            this.getByRsyncConfigName(rsyncConfig.rsyncConfigName, function (error, duplicateRsyncConfig) {
                if (error) {
                    callback(error);
                } else if (duplicateRsyncConfig) {
                    callback("A rsync config with name '" + rsyncConfig.rsyncConfigName + "' already exists");
                } else {
                    db.insert(rsyncConfig);
                    callback(null);
                }

            });
        }
    },

    /**
     * @param callback {function(String, RsyncConfig[])}
     */
    findAll: function findAll(callback) {
        db.find({rsyncConfigName: {$exists: true}}, callback);
    },

    /**
     * @param rsyncConfigName {String}
     * @param callback {function(String, RsyncConfig)}
     */
    getByRsyncConfigName: function getByRsyncConfigName(rsyncConfigName, callback) {
        db.find({rsyncConfigName: rsyncConfigName}, function (error, rsyncConfigs) {
            if (!rsyncConfigs || rsyncConfigs.length === 0) {
                callback(error, null);
            } else if (rsyncConfigs.length > 1) {
                callback(rsyncConfigs.length + ' rsync configs found with name: ' + rsyncConfigName, null);
            } else {
                callback(error, rsyncConfigs[0]);
            }
        });
    }
};

module.exports = rsyncRepository;
