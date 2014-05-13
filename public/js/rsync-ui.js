//var fs = require('fs');

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
    .controller('RsyncCommandController', ['$scope', function ($scope) {

        $scope.rsyncConfig = new RsyncConfig();
        $scope.savedRsyncConfigNameToLoad = '';

        $scope.saveRsyncConfig = function () {
            var Store = require("jfs");
            var db = new Store("/tmp/scratch");

            db.saveSync($scope.rsyncConfig.name, $scope.rsyncConfig);

            var index = $scope.savedRsyncConfigs();
            if (index.files.indexOf($scope.rsyncConfig.name) == -1) {
                index.files.push($scope.rsyncConfig.name);
                db.saveSync('index', index);
            }
        };

        $scope.savedRsyncConfigs = function () {
            var Store = require("jfs");
            var db = new Store("/tmp/scratch");

            var listing = db.allSync();
            index = listing.index;
            if (index === undefined) index = {files: [] };

            index.files.forEach(function (file) {
                if (listing[file] === undefined) {
                    index.files.pop(file);
                }
            });

            return index;
        };

        $scope.loadSavedRsyncConfig = function () {
            var Store = require("jfs");
            var db = new Store("/tmp/scratch");

            $scope.rsyncConfig = db.getSync($scope.savedRsyncConfigNameToLoad);
        };

        $scope.spawnRsyncCommand = function () {
            $scope.rsyncOutput = '';
//            var spawnedLs = require('child_process').spawn('ls', ['-R', '/usr']);
            var spawnedLs = require('child_process').spawn('ls', ['-R /usr']);
            spawnedLs.stdout.on('data', function (data) {
                $scope.rsyncOutput += data;
                // TODO Find out correct way to do this. I should pass the function to the $apply method.
                $scope.$apply();
            });
            spawnedLs.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            spawnedLs.on('close', function (code) {
                console.log('ended with code: ' + code);
            });
        };
    }])
    .config(function ($stateProvider, $urlRouterProvider) {
        // For any unmatched url, redirect to /state1
        $urlRouterProvider.otherwise("/rsync");

        $stateProvider
            .state('rsync', {
                url: "/rsync",
                templateUrl: "partials/rsync.html",
                controller: 'RsyncCommandController'
            });
    });
