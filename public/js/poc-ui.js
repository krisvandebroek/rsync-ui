var fs = require('fs');
var FS = require('q-io/fs');

angular.module('poc-ui', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider
            .state('poc', {
                url: "/poc",
                templateUrl: "partials/poc.html",
                controller: 'poc-controller'
            });
    })
    .controller('poc-controller', ['$scope', function ($scope) {
        // Test to read files from the filesystem
        $scope.filenames = fs.readdirSync('/opt/');

        console.log('Next: Reading file');
        // Test reading the contents of a file on the filesystem
        $scope.fileContents = fs.readFileSync('/etc/bashrc').toString('utf8');

        $scope.tryNodeLocalStorage = function () {

            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('/tmp/scratch');

            console.log('Read before write: ' + localStorage.getItem('myFirstKey'));
            localStorage.setItem('myFirstKey', 'myFirstValue');
            console.log('Read after write: ' + localStorage.getItem('myFirstKey'));
        };

        $scope.storedValue = function () {
            var LocalStorage = require('node-localstorage').LocalStorage;
            localStorage = new LocalStorage('/tmp/scratch');
            return localStorage.getItem('myFirstKey');
        };

        $scope.tryJsonFileStorage = function () {
            var Store = require("jfs");
            var db = new Store("/tmp/scratch");
            var d = {
                foo: "bar"
            };

            db.saveSync("myKey", d);
        };

        $scope.storedJfsValue = function () {
            var Store = require('jfs');
            var db = new Store('/tmp/scratch');
            return db.getSync("myKey").foo;
        };

        console.log('Using q-io');
        // Test to read files from the filesystem
        FS.list('/opt/').then(function (filenames) {
            console.log('Directory read with q-io');
            $scope.qfilenames = filenames;
        });

        // Test reading the contents of a file on the filesystem
        FS.read('/etc/bashrc').then(function (content) {
            console.log('File read with q-io');
            $scope.qfileContents = content;
        });

        var dataPath = require('nw.gui').App.dataPath;
        var path = require('path');
        console.log('Webkit storage location: ' + dataPath);
        var DataStore = require('nedb');
        var db = new DataStore({
            filename: path.join(dataPath, 'poc.db'),
            autoload: true
        });

        db.insert({a: 5, b: 6});

        db.find({a: 5}, function (err, docs) {
            console.log(docs);
        });



    }]);