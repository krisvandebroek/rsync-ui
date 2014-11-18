//var fs = require('fs');

var rsync_ui_app_dependencies = [
    'ui.router',
    'ui.bootstrap',
    'poc-ui'
];

angular.module('rsync-ui-app', rsync_ui_app_dependencies)
    .config(function ($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise("/rsync");

        $stateProvider
            .state('rsync', {
                url: "/rsync",
                templateUrl: "partials/rsync.html",
                controller: 'RsyncCommandController'
            });
    })
    .controller('RsyncCommandController', ['$scope', function ($scope) {

        $scope.rsyncConfig = new RsyncConfig();
        $scope.savedRsyncConfigNameToLoad = '';

        $scope.createTerminalCommand = createTerminalCommand;

        $scope.saveRsyncConfig = function () {
            rsyncRepository.save($scope.rsyncConfig);
            //var Store = require("jfs");
            //var db = new Store("/tmp/scratch");
            //
            //db.saveSync($scope.rsyncConfig.rsyncConfigName, $scope.rsyncConfig);
            //
            //var index = $scope.savedRsyncConfigs();
            //if (index.files.indexOf($scope.rsyncConfig.rsyncConfigName) == -1) {
            //    index.files.push($scope.rsyncConfig.rsyncConfigName);
            //    db.saveSync('index', index);
            //}
        };

        $scope.savedRsyncConfigs = function () {
            var rsyncConfigs = rsyncRepository.findAll();
            return {files: rsyncConfigs};
            //var Store = require("jfs");
            //var db = new Store("/tmp/scratch");
            //
            //var listing = db.allSync();
            //index = listing.index;
            //if (index === undefined) index = {files: [] };
            //
            //index.files.forEach(function (file) {
            //    if (listing[file] === undefined) {
            //        index.files.pop(file);
            //    }
            //});
            //
            //return index;
        };

        $scope.loadSavedRsyncConfig = function () {
            $scope.rsyncConfig = rsyncRepository.getByRsyncConfigName($scope.savedRsyncConfigNameToLoad);
            //$scope.rsyncConfig.__proto__ = RsyncConfig.prototype;

            //var Store = require("jfs");
            //var db = new Store("/tmp/scratch");
            //$scope.rsyncConfig = db.getSync($scope.savedRsyncConfigNameToLoad);
            //$scope.rsyncConfig.__proto__ = RsyncConfig.prototype;
        };

        $scope.spawnRsyncCommand = function () {
            $scope.rsyncOutput = '';
            var command = createTerminalCommand($scope.rsyncConfig);
            var spawnedCommand = require('child_process').spawn(command.command, command.options);
            spawnedCommand.stdout.on('data', function (data) {
                $scope.rsyncOutput += data;
                // TODO Find out correct way to do this. I should pass the function to the $apply method.
                $scope.$apply();
            });
            spawnedCommand.stderr.on('data', function (data) {
                console.log('stderr: ' + data);
            });
            spawnedCommand.on('close', function (code) {
                console.log('ended with code: ' + code);
            });
        };
    }]);
