var appDataPath = require('nw.gui').App.dataPath;
var path = require('path');
console.log('Webkit storage location: ' + appDataPath);
var DataStore = require('nedb');
var db = new DataStore({
    filename: path.join(appDataPath, 'poc.db'),
    autoload: true
});

var rsyncRepository = {

    save: function save(rsyncConfig) {
        db.insert(rsyncConfig);
    },

    findAll: function findAll() {
        return db.find({rsyncConfigName: {$exists: true}});
    },

    getByRsyncConfigName: function getByRsyncConfigName(rsyncConfigName) {
        return db.findOne({rsyncConfigName: rsyncConfigName});
    }

};


